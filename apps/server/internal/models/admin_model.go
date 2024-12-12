package models

type Admin struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Username          string  `json:"username"`
	Password          string  `json:"-"`
	Balance           float64 `json:"balance"`
	Exposure          float64 `json:"exposure"`
	Settlement        float64 `json:"settlement"`
	SportsShare       int64   `json:"sportsShare"`
	ChildLevel        int64   `json:"childLevel"`
	Blocked           bool    `json:"blocked"`
	MarketCommission  int64   `json:"marketCommission"`
	SessionCommission int64   `json:"sessionCommission"`
	CreatedAt         string  `json:"createdAt"`
}
