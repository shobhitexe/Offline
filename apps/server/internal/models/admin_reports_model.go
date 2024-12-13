package models

type List struct {
	ID                string  `json:"id"`
	Role              string  `json:"role"`
	Name              string  `json:"name"`
	Username          string  `json:"username"`
	Password          string  `json:"-"`
	Downline          int64   `json:"downline"`
	Balance           float64 `json:"balance"`
	Exposure          float64 `json:"exposure"`
	Settlement        float64 `json:"settlement"`
	PnL               float64 `json:"pnl"`
	AvailableBalance  float64 `json:"availBal"`
	SportsShare       int64   `json:"sportsShare"`
	ChildLevel        int64   `json:"childLevel"`
	Blocked           bool    `json:"blocked"`
	MarketCommission  int64   `json:"marketCommission"`
	SessionCommission int64   `json:"sessionCommission"`
	CreatedAt         string  `json:"createdAt"`
}

type BalanceSheetReport struct {
	UserType string  `json:"userType"`
	UserId   string  `json:"id"`
	UserName string  `json:"username"`
	Balance  float64 `json:"balance"`
}

type BalanceSheet struct {
	Profit []BalanceSheetReport `json:"profit"`
	Loss   []BalanceSheetReport `json:"loss"`
}

type PerUserBalanceSheetReport struct {
	UserID     string
	UserName   string
	Name       string
	Settlement float64
	Result     string
}
