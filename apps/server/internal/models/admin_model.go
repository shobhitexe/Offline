package models

type Admin struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Username    string `json:"username"`
	Password    string `json:"-"`
	Balance     string `json:"balance"`
	SportsShare int64  `json:"sportsShare"`
	ChildLevel  int64  `json:"childLevel"`
	Blocked     bool   `json:"blocked"`
	CreatedAt   string `json:"createdAt"`
}
