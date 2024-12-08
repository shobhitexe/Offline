package models

type User struct {
	ID                string `json:"_id"`
	Name              string `json:"name"`
	Username          string `json:"username"`
	Password          string `json:"-"`
	Balance           string `json:"balance"`
	MarketCommission  int64  `json:"marketCommission"`
	SessionCommission int64  `json:"sessionCommission"`
	CreatedAt         string `json:"createdAt"`
}

type UserWallet struct {
	Balance  float64 `json:"balance"`
	Exposure float64 `json:"exposure"`
}
