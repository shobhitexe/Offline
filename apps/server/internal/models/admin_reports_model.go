package models

type BalanceSheetReport struct {
	UserType string  `json:"userType"`
	UserId   int64   `json:"id"`
	UserName string  `json:"username"`
	Name     string  `json:"name"`
	Balance  float64 `json:"balance"`
}

type BalanceSheet struct {
	Profit []BalanceSheetReport `json:"profit"`
	Loss   []BalanceSheetReport `json:"loss"`
}

type PerUserBalanceSheetReport struct {
	UserID   int64
	UserName string
	Name     string
	Profit   float64
	Exposure float64
	Result   string
}
