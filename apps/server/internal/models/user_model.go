package models

type User struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Username          string  `json:"username"`
	Password          string  `json:"-"`
	Balance           float64 `json:"balance"`
	Exposure          float64 `json:"exposure"`
	PnL               float64 `json:"pnl"`
	AvailableBalance  float64 `json:"availBal"`
	Settlement        float64 `json:"settlement"`
	MarketCommission  int64   `json:"marketCommission"`
	SessionCommission int64   `json:"sessionCommission"`
	CreatedAt         string  `json:"createdAt"`

	AddedByName     string  `json:"addedByName"`
	AddedByUserName string  `json:"addedByUsername"`
	AddedByBalance  float64 `json:"addedByBalance"`
}

type UserWallet struct {
	ID       string  `json:"id"`
	Balance  float64 `json:"balance"`
	Exposure float64 `json:"exposure"`
}

type Transactions struct {
	Amount          float64
	TransactionType string
	CreatedAt       string
}

type AccountStatement struct {
	Credit          float64 `json:"credit"`
	Debit           float64 `json:"debit"`
	TransactionType string  `json:"transactionType"`
	MatchName       string  `json:"matchName"`
	MarketType      string  `json:"marketType"`
	RunnerName      string  `json:"runnerName"`
	CreatedAt       string  `json:"createdAt"`
}
