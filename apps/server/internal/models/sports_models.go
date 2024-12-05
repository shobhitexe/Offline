package models

type ActiveEvents struct {
	MatchName   string `json:"matchName"`
	EventId     string `json:"eventId"`
	MatchType   string `json:"matchType"`
	OpeningTime string `json:"openingTime"`
}
