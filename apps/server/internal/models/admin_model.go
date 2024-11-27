package models

type Admin struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Username    string `json:"username"`
	Password    string `json:"-"`
	Balance     string `json:"balance"`
	SportsShare string `json:"sportsShare"`
	CreatedAt   string `json:"createdAt"`
}
