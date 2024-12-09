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
	handlers map[string]EventHandler

	store *WebsocketStore
}

func NewManager(db *pgxpool.Pool, redis *redis.Client) *Manager {
	m := &Manager{
		clients:    make(ClientList),
		handlers:   make(map[string]EventHandler),
		clientsMap: make(map[string]*Client),
		store:      NewWebsocketStore(db, redis),
	}

	m.setupEventHandlers()

	return m

}

func (m *Manager) setupEventHandlers() {
	m.handlers[EventWallet] = sendWalletBalance
	m.handlers[MatchDetails] = sendMatchDetails
}

func sendMatchDetails(event Event, c *Client) error {

	var matchEvent MatchEvent

	if err := json.Unmarshal(event.Payload, &matchEvent); err != nil {
		return fmt.Errorf("Bad payload in request: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	d, err := c.manager.store.GetEventDetails(ctx, matchEvent.EventId)

	if err != nil {
		return err
	}

	broadMessage := models.Response{
		Message: "Details Fetched",
		Data:    d,
	}

	data, err := json.Marshal(broadMessage)

	if err != nil {
		return fmt.Errorf("failed to marshal broadcast message: %v", err)

	}

	outGoingEvent := Event{
		Payload: data,
		Type:    MatchDetails,
	}

	targetClient, exists := c.manager.clientsMap[matchEvent.ConnectionId]
	if !exists {
		return fmt.Errorf("client not found: %s", matchEvent.ConnectionId)
	}

	targetClient.egress <- outGoingEvent

	return nil

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
