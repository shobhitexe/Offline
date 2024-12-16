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

type SportsSettings struct {
	ID                   int    `json:"id" validate:"required"`
	Name                 string `json:"name" validate:"required"`
	MaxStake             uint64 `json:"minStake" validate:"required"`
	MinStake             uint64 `json:"maxStake" validate:"required"`
	BeforeInPlayMaxStake uint64 `json:"beforeInPlayMaxStake" validate:"required"`
	BeforeInPlayMinStake uint64 `json:"beforeInPlayMinStake" validate:"required"`
	MaxOdds              uint64 `json:"maxOdds" validate:"required"`
	BetDelay             uint16 `json:"betDelay" validate:"required"`
}
