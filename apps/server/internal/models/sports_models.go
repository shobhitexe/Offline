package models

type ActiveEvents struct {
	EventId       string `json:"eventId"`
	CompetitionId string `json:"competitionId"`
	EventName     string `json:"eventName"`
	EventTime     string `json:"eventTime"`
	MatchOdds     MarketInfo
}

type ActiveBet struct {
	ID         string
	MatchId    string
	EventId    string
	UserId     string
	OddsPrice  float64
	OddsRate   float64
	BetType    string
	Profit     float64
	Exposure   float64
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

type ActiveExposureByTeam struct {
	Team       string  `json:"team"`
	Exposure   float64 `json:"exposure"`
	BetType    string  `json:"betType"`
	MarketType string  `json:"marketType"`
}

type BetHistoryPerGame struct {
	Selection string  `json:"selection"`
	Odds      float64 `json:"odds"`
	Stake     float64 `json:"stake"`
	PNL       float64 `json:"pnl"`
	BetType   string  `json:"betType"`
}
