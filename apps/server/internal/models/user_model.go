package models

type User struct {
	ID                string `json:"id"`
	Name              string `json:"name"`
	Username          string `json:"username"`
	Password          string `json:"-"`
	Balance           string `json:"balance"`
	MarketCommission  int64  `json:"marketCommission"`
	SessionCommission int64  `json:"sessionCommission"`
	CreatedAt         string `json:"createdAt"`
}