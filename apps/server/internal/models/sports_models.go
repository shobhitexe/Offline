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
	BookMaker     BookMakerInfo `json:"BookMaker"`
	CompetitionId string        `json:"CompetitionId"`
	EventId       string        `json:"EventId"`
	EventName     string        `json:"EventName"`
	EventTime     string        `json:"EventTime"`
	Fancy         FancyInfo     `json:"Fancy"`
	MatchOdds     MarketInfo    `json:"MatchOdds"`
	SportsId      string        `json:"SportsId"`
}

type BookMakerInfo struct {
	MarketId   string   `json:"MarketId"`
	MarketName string   `json:"MarketName"`
	Runners    []Runner `json:"runners"`
}

type FancyInfo struct {
	MarketId   string   `json:"MarketId"`
	MarketName string   `json:"MarketName"`
	Runners    []Runner `json:"runners"`
}

type MarketInfo struct {
	MarketId   string   `json:"MarketId"`
	MarketName string   `json:"MarketName"`
	Runners    []Runner `json:"runners"`
}

type Runner struct {
	Back       PriceRate `json:"Back"`
	Lay        PriceRate `json:"Lay"`
	RunnerId   string    `json:"RunnerId"`
	RunnerName string    `json:"RunnerName"`
	Status     string    `json:"Status"`
}

type PriceRate struct {
	Price float64 `json:"Price"`
	Rate  float64 `json:"Rate"`
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
	Selection  string  `json:"selection"`
	Odds       float64 `json:"odds"`
	Stake      float64 `json:"stake"`
	PNL        float64 `json:"pnl"`
	BetType    string  `json:"betType"`
	MarketName string  `json:"marketName"`
	RunnerId   string  `json:"runnerId"`
}

type SelectionData struct {
	TotalPNL   float64 `json:"totalPnl"`
	TotalStake float64 `json:"totalStake"`
}