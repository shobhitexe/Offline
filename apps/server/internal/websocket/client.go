package websocket

import (
	"encoding/json"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var (
	pongWait = 10 * time.Second

	pingInterval = (pongWait * 9) / 10
)

type ClientList map[*Client]bool

type Client struct {
	connection *websocket.Conn
	manager    *Manager

	egress   chan Event
	clientId string

	retryCount int
	maxRetries int
}

func NewClient(conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		connection: conn,
		manager:    manager,
		egress:     make(chan Event, 100),
		clientId:   uuid.NewString(),
	}
}

func (c *Client) readMessages() {
	defer func() {
		c.manager.removeClient(c)
	}()

	if err := c.connection.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		log.Println("Failed to set read deadline:", err)
		return
	}

	c.connection.SetReadLimit(512)

	c.connection.SetPongHandler(c.pongHandler)

	for {

		if c.connection == nil {
			log.Println("WebSocket connection is nil, stopping read.")
			return
		}

		_, p, err := c.connection.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Error reading messages: %v", err)
			}
			return
		}

		var request Event
		if err := json.Unmarshal(p, &request); err != nil {
			log.Printf("Error unmarshaling event: %v", err)
			continue
		}

		if err := c.manager.routeEvents(request, c); err != nil {
			log.Printf("Error handling event: %v", err)
		}

	}
}

func (c *Client) writeMessages() {
	defer func() {
		c.manager.removeClient(c)
	}()

	tickerInterval := time.NewTicker(pingInterval)
	defer tickerInterval.Stop()

	for {
		select {
		case message, ok := <-c.egress:
			if !ok {
				if err := c.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
					log.Printf("Connection closed: %v", err)
				}
				return
			}

			if c.connection == nil {
				log.Println("WebSocket connection is nil, stopping write.")
				c.manager.removeClient(c)
				return
			}

			data, err := json.Marshal(message)

			if err != nil {
				log.Printf("Error marshaling message: %v", err)
				return
			}

			if err := c.connection.WriteMessage(websocket.TextMessage, data); err != nil {
				if websocket.IsCloseError(err) {
					log.Println("Connection closed, stopping message write.")
					return
				}
				log.Printf("Failed to send message: %v", err)
			}

		case <-tickerInterval.C:
			if c.connection == nil {
				log.Println("WebSocket connection is nil, stopping ping.")
				return
			}

			if err := c.connection.WriteMessage(websocket.PingMessage, []byte("")); err != nil {
				log.Printf("Failed to send ping message: %v", err)
				c.manager.removeClient(c)
				return
			}
		}
	}
}

func (c *Client) pongHandler(pongMsg string) error {
	return c.connection.SetReadDeadline(time.Now().Add(pongWait))
}
