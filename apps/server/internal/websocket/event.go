package websocket

import (
	"encoding/json"
)

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type EventHandler func(event Event, c *Client) error

const (
	EventWallet    = "wallet"
	SendWalletData = "wallet_balance"
	EventSendId    = "send_id"
	MatchDetails   = "event_data"
)

type WalletEvent struct {
	ID           string `json:"id"`
	ConnectionId string `json:"connectionId"`
}

type MatchEvent struct {
	EventId      string `json:"eventId"`
	ConnectionId string `json:"connectionId"`
}

type SendWalletBalanceEvent struct {
	Balance  float64 `json:"balance"`
	Exposure float64 `json:"exposure"`
	To       string  `json:"to"`
}
