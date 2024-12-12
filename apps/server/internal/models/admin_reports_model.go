package models

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
