package models

type ActiveEvents struct {
	MatchName   string `json:"matchName"`
	EventId     string `json:"eventId"`
	MatchType   string `json:"matchType"`
	OpeningTime string `json:"openingTime"`
}

type ActiveBet struct {
	ID         string
	MatchId    string
	EventId    string
	UserId     string
	OddsPrice  float64
	OddsRate   float64
	BetType    string
	Amount     int64
	MarketName string
	MarketId   string
	RunnerName string
	RunnerID   string
}

// ///
type Odds struct {
	BookMaker     BookMakerInfo
	CompetitionId string
	EventId       string
	EventName     string
	EventTime     string
	Fancy         FancyInfo
	MatchOdds     MarketInfo
	SportsId      string
	Version       string
	ID            string
}

type BookMakerInfo struct {
	MarketId   string
	MarketName string
	Runners    []Runner
}

type FancyInfo struct {
	MarketId   string
	MarketName string
	Runners    []Runner
}

type MarketInfo struct {
	MarketId   string
	MarketName string
	Runners    []Runner
}

type Runner struct {
	Back       PriceRate
	Lay        PriceRate
	RunnerId   string
	RunnerName string
	Status     string
}

type PriceRate struct {
	Price float64
	Rate  float64
}

/////

type MatchOddsResult struct {
	EventID   string    `json:"EventId"`
	EventName string    `json:"EventName"`
	MatchOdds MatchOdds `json:"MatchOdds"`
}

type MatchOdds struct {
	MarketName string         `json:"MarketName"`
	MarketID   string         `json:"MarketId"`
	Runners    []RunnerResult `json:"runners"`
}

type RunnerResult struct {
	RunnerName string
	RunnerID   string
	EventID    string
	EventName  string
	MarketID   string
	MarketName string
	Status     string
}
