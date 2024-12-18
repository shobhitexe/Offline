package websocket

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
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
	}

	m.setupEventHandlers()
	m.subscribeToSportsUpdates()

	return m

}

func (m *Manager) setupEventHandlers() {
	m.handlers[EventWallet] = sendWalletBalance
	m.handlers[EventId] = mapUserIdToEventId
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

func (m *Manager) subscribeToSportsUpdates() {
	go func() {

		ctx := context.Background()

		pubsub := m.store.redis.Subscribe(ctx, "sports:events")
		defer pubsub.Close()

		ch := pubsub.Channel()
		for msg := range ch {
			var event Matchdata
			if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
				log.Printf("Failed to parse event: %v", err)
				continue
			}

			clientsForEventId, exists := m.clientsMapByEventId[event.EventId]
			if !exists {
				// log.Printf("No clients found for eventId %s", event.EventId)
				continue
			}

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

			outGoingEvent := Event{
				Payload: json.RawMessage(event.Details),
				Type:    SportsUpdate,
			}

			for _, targetClient := range clientsForEventId {
				select {
				case targetClient.egress <- outGoingEvent:
				default:
					log.Printf("Client %s is not ready to receive the event, skipping.", targetClient.clientId)
				}
			}
		}
	}()
}

func sendWalletBalance(event Event, c *Client) error {

	var walletEvent WalletEvent

	if err := json.Unmarshal(event.Payload, &walletEvent); err != nil {
		return fmt.Errorf("Bad payload in request: %v", err)
	}

	if err := broadCastMessage(c, walletEvent); err != nil {
		return err
	}

	return nil

}

func broadCastMessage(target *Client, walletEvent WalletEvent) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	wallet, err := target.manager.store.UserBalance(ctx, walletEvent.ID)

	if err != nil {
		return fmt.Errorf("failed to fetch user balance: %v", err)
	}

	broadMessage := SendWalletBalanceEvent{
		Balance:  wallet.Balance,
		Exposure: wallet.Exposure,
		To:       walletEvent.ID,
	}

	data, err := json.Marshal(broadMessage)

	if err != nil {
		return fmt.Errorf("failed to marshal broadcast message: %v", err)

	}

	outGoingEvent := Event{
		Payload: data,
		Type:    SendWalletData,
	}

	targetClient, exists := target.manager.clientsMap[walletEvent.ConnectionId]
	if !exists {
		return fmt.Errorf("client not found: %s", walletEvent.ConnectionId)
	}

	targetClient.egress <- outGoingEvent

	return nil

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

func (m *Manager) removeCLient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.clients[client]; ok {
		client.connection.Close()
		delete(m.clients, client)
		delete(m.clientsMap, client.clientId)

		eventId := m.eventIdMap[client.clientId]
		clients := m.clientsMapByEventId[eventId]
		for i, c := range clients {
			if c.clientId == client.clientId {
				m.clientsMapByEventId[eventId] = append(clients[:i], clients[i+1:]...)
				break
			}
		}
		delete(m.eventIdMap, client.clientId)

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
