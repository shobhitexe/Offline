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
	EventId        = "event_id"
	SportsUpdate   = "sports_update"

	UserId = "user_id"
)

type WalletEvent struct {
	ID           string `json:"id"`
	ConnectionId string `json:"connectionId"`
}

type MatchEvent struct {
	EventId      string `json:"eventId"`
	ConnectionId string `json:"connectionId"`
}

type UserIdMap struct {
	EventId string `json:"eventId"`
}

type UserWalletIdMap struct {
	UserId string `json:"userId"`
}

type SendWalletBalanceEvent struct {
	Balance  float64 `json:"balance"`
	Exposure float64 `json:"exposure"`
	To       string  `json:"to"`
}

type Matchdata struct {
	EventId string `json:"eventId"`
	Details string `json:"details"`
}
