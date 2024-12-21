package websocket

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"server/internal/models"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

var (
	websocketUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     CheckOrigin,
	}
)

type Manager struct {
	clients    ClientList
	clientsMap map[string]*Client
	sync.RWMutex
	handlers            map[string]EventHandler
	eventIdMap          map[string]string
	clientsMapByEventId map[string][]*Client

	userIdMap map[string]string

	store *WebsocketStore
}

func NewManager(db *pgxpool.Pool, redis *redis.Client) *Manager {
	m := &Manager{
		clients:             make(ClientList),
		handlers:            make(map[string]EventHandler),
		clientsMap:          make(map[string]*Client),
		store:               NewWebsocketStore(db, redis),
		eventIdMap:          make(map[string]string),
		clientsMapByEventId: make(map[string][]*Client),
		userIdMap:           make(map[string]string),
	}

	m.setupEventHandlers()

	m.subscribeToSportsUpdates()
	m.subscribeToWalletUpdates()

	return m

}

func (m *Manager) setupEventHandlers() {
	// m.handlers[EventWallet] = sendWalletBalance
	m.handlers[EventId] = mapUserIdToEventId

	// m.handlers[UserId] = mapUserIdToSocketId
}

func mapUserIdToEventId(event Event, c *Client) error {

	var user UserIdMap

	if err := json.Unmarshal(event.Payload, &user); err != nil {
		return fmt.Errorf("Bad payload in request: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(5)*time.Second)
	defer cancel()

	expiry := time.Now().Add(5 * time.Minute).Unix()
	z := redis.Z{
		Score:  float64(expiry),
		Member: user.EventId,
	}
	if err := c.manager.store.redis.ZAdd(ctx, "sports:active", z).Err(); err != nil {
		log.Printf("Failed to update active event in Redis: %s", err)
	}

	c.manager.eventIdMap[c.clientId] = user.EventId

	c.manager.clientsMapByEventId[user.EventId] = append(c.manager.clientsMapByEventId[user.EventId], c)

	return nil
}

func mapUserIdToSocketId(event Event, c *Client) error {
	var user UserWalletIdMap

	if err := json.Unmarshal(event.Payload, &user); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	if user.UserId == "" {
		return fmt.Errorf("missing UserId in payload")
	}

	c.manager.userIdMap[c.clientId] = user.UserId

	return nil
}

func (m *Manager) subscribeToWalletUpdates() {

	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:

				userIds := make([]string, 0, len(m.userIdMap))
				for _, id := range m.userIdMap {
					userIds = append(userIds, id)
				}

				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancel()

				query := `SELECT id, balance, exposure FROM users WHERE id = ANY($1)`
				rows, err := m.store.db.Query(ctx, query, userIds)
				if err != nil {
					log.Printf("failed to fetch balance: %v", err)
					continue
				}
				defer rows.Close()

				var wg sync.WaitGroup
				for rows.Next() {
					var wallet models.UserWallet
					if err := rows.Scan(&wallet.ID, &wallet.Balance, &wallet.Exposure); err != nil {
						continue
					}

					wg.Add(1)
					go func(wallet models.UserWallet) {
						defer wg.Done()

						data := SendWalletBalanceEvent{
							To:       wallet.ID,
							Balance:  wallet.Balance,
							Exposure: wallet.Exposure,
						}

						d, err := json.Marshal(&data)
						if err != nil {
							return
						}

						event := Event{
							Type:    EventWallet,
							Payload: d,
						}

						m.RLock()
						for user := range m.userIdMap {
							client, exists := m.clientsMap[user]
							if exists {
								select {
								case client.egress <- event:
									// log.Printf("Sent wallet update to client %s", wallet.ID)
								default:
									log.Printf("Client %s is not ready to receive updates, skipping.", wallet.ID)
								}
							}
						}
						m.RUnlock()
					}(wallet)
				}

				wg.Wait()
			}
		}
	}()
}

func (m *Manager) subscribeToSportsUpdates() {
	go func() {

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		pubsub := m.store.redis.Subscribe(ctx, "sports:events")
		defer pubsub.Close()

		ch := pubsub.Channel()
		for msg := range ch {
			var event Matchdata
			if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
				log.Printf("Failed to parse event: %v", err)
				continue
			}

			m.RLock()
			clientsForEventId, exists := m.clientsMapByEventId[event.EventId]
			m.RUnlock()
			if !exists {
				// log.Printf("No clients found for eventId %s", event.EventId)
				continue
			}

			outGoingEvent := Event{
				Payload: json.RawMessage(event.Details),
				Type:    SportsUpdate,
			}

			for _, targetClient := range clientsForEventId {
				select {
				case targetClient.egress <- outGoingEvent:
					go func(eventId string) {
						expiry := time.Now().Add(5 * time.Minute).Unix()
						z := redis.Z{
							Score:  float64(expiry),
							Member: eventId,
						}
						if err := m.store.redis.ZAdd(ctx, "sports:active", z).Err(); err != nil {
							log.Printf("Failed to update active event in Redis: %s", err)
						}
					}(event.EventId)
				default:
					log.Printf("Client %s is not ready to receive the event, skipping.", targetClient.clientId)
					m.Lock()
					targetClient.retryCount++
					m.Unlock()
					if targetClient.retryCount > targetClient.maxRetries {
						log.Printf("Client %s exceeded max retries, removing.", targetClient.clientId)
						m.removeClient(targetClient)
					} else {
						log.Printf("Client %s is not ready, retry %d/%d.", targetClient.clientId, targetClient.retryCount, targetClient.maxRetries)
						time.Sleep(100 * time.Millisecond)
					}
				}
			}
		}
	}()
}

func (m *Manager) routeEvents(event Event, c *Client) error {

	if handler, ok := m.handlers[event.Type]; ok {
		if err := handler(event, c); err != nil {
			return err
		}

		return nil
	} else {
		return errors.New("No such event type")
	}

}

func (m *Manager) ServerWs(w http.ResponseWriter, r *http.Request) {

	log.Printf("New Conn")

	con, err := websocketUpgrader.Upgrade(w, r, nil)

	if err != nil {
		http.Error(w, "Failed to upgrade websocket connection", http.StatusInternalServerError)
		return
	}

	client := NewClient(con, m)

	// log.Printf(client.clientId)

	m.addClient(client)

	payload, err := json.Marshal(map[string]string{"connectionId": client.clientId})

	go client.readMessages()
	go client.writeMessages()

	outGoingEvent := Event{
		Payload: payload,
		Type:    EventSendId,
	}

	client.egress <- outGoingEvent

	// con.Close()

}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	m.clients[client] = true
	m.clientsMap[client.clientId] = client
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.clients[client]; !ok {
		return
	}

	if err := client.connection.Close(); err != nil {
		log.Printf("Failed to close connection for client %s: %v", client.clientId, err)
	}

	delete(m.clients, client)
	delete(m.clientsMap, client.clientId)
	delete(m.userIdMap, client.clientId)

	if eventId, exists := m.eventIdMap[client.clientId]; exists {
		m.removeFromEventIdMap(client.clientId, eventId)
		delete(m.eventIdMap, client.clientId)
	}
}

func (m *Manager) removeFromEventIdMap(clientId string, eventId string) {
	clients, exists := m.clientsMapByEventId[eventId]
	if !exists {
		return
	}

	for i, c := range clients {
		if c.clientId == clientId {
			m.clientsMapByEventId[eventId] = append(clients[:i], clients[i+1:]...)
			break
		}
	}

	if len(m.clientsMapByEventId[eventId]) == 0 {
		delete(m.clientsMapByEventId, eventId)
	}
}

func CheckOrigin(r *http.Request) bool {

	origin := r.Header.Get("Origin")

	switch origin {
	case "http://localhost:3002":
		return true
	default:
		return true

	}

}
