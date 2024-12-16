package models

type Admin struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Username          string  `json:"username"`
	Password          string  `json:"-"`
	Balance           float64 `json:"balance"`
	Exposure          float64 `json:"exposure"`
	Settlement        float64 `json:"settlement"`
	SportsShare       int64   `json:"sportsShare"`
	ChildLevel        int64   `json:"childLevel"`
	Blocked           bool    `json:"blocked"`
	MarketCommission  int64   `json:"marketCommission"`
	SessionCommission int64   `json:"sessionCommission"`
	CreatedAt         string  `json:"createdAt"`
}

type SportsSettings struct {
	ID                   int    `json:"id" validate:"required"`
	Name                 string `json:"name" validate:"required"`
	MaxStake             uint64 `json:"minStake" validate:"required"`
	MinStake             uint64 `json:"maxStake" validate:"required"`
	BeforeInPlayMaxStake uint64 `json:"beforeInPlayMaxStake" validate:"required"`
	BeforeInPlayMinStake uint64 `json:"beforeInPlayMinStake" validate:"required"`
	MaxOdds              uint64 `json:"maxOdds" validate:"required"`
	BetDelay             uint16 `json:"betDelay" validate:"required"`
}

type TournamentSettings struct {
	ID             int    `json:"id"`
	TournamentName string `json:"tournamentName"`
	SportsID       int    `json:"sportsId"`
	Active         bool   `json:"active"`

	// Pre MO stakes
	PreMOStakesMin int `json:"preMOStakesMin"`
	PreMOStakesMax int `json:"preMOStakesMax"`

	// Post MO stakes
	PostMOStakesMin int `json:"postMOStakesMin"`
	PostMOStakesMax int `json:"postMOStakesMax"`

	// Pre BM stakes
	PreBMStakesMin int `json:"preBMStakesMin"`
	PreBMStakesMax int `json:"preBMStakesMax"`

	// Post BM stakes
	PostBMStakesMin int `json:"postBMStakesMin"`
	PostBMStakesMax int `json:"postBMStakesMax"`

	// Pre Fancy stakes
	PreFancyStakesMin int `json:"preFancyStakesMin"`
	PreFancyStakesMax int `json:"preFancyStakesMax"`

	// Post Fancy stakes
	PostFancyStakesMin int `json:"postFancyStakesMin"`
	PostFancyStakesMax int `json:"postFancyStakesMax"`

	// Toss stakes
	TossStakesMin int `json:"tossStakesMin"`
	TossStakesMax int `json:"tossStakesMax"`

	// Bet Delay
	BetDelayMO int `json:"betDelayMO"`
	BetDelayBM int `json:"betDelayBM"`
	BetDelayTO int `json:"betDelayTO"`
	BetDelayFA int `json:"betDelayFA"`

	// Max Profit
	MaxProfitMO int `json:"maxProfitMO"`
	MaxProfitBM int `json:"maxProfitBM"`
	MaxProfitTO int `json:"maxProfitTO"`
	MaxProfitFA int `json:"maxProfitFA"`

	// Max Odds
	MaxOdds int `json:"maxOdds"`
}

type MatchDataWithSettings struct {
	EventName            string
	EventId              string
	CompetitionId        string
	MatchOdds            string
	Category             string
	EventTime            string
	Name                 string
	MaxStake             float64
	MinStake             float64
	BeforeInPlayMaxStake float64
	BeforeInPlayMinStake float64
	BetDelay             string
	TournamentName       string
	Active               bool
	PreMOStakesMin       float64
	PreMOStakesMax       float64
	PostMOStakesMin      float64
	PostMOStakesMax      float64
	PreBMStakesMin       float64
	PreBMStakesMax       float64
	PostBMStakesMin      float64
	PostBMStakesMax      float64
	PreFancyStakesMin    float64
	PreFancyStakesMax    float64
	PostFancyStakesMin   float64
	PostFancyStakesMax   float64
	TossStakesMin        float64
	TossStakesMax        float64
	BetDelayMO           string
	BetDelayBM           string
	BetDelayTO           string
	BetDelayFA           string
	MaxProfitMO          float64
	MaxProfitBM          float64
	MaxProfitTO          float64
	MaxProfitFA          float64
	MaxOdds              float64
	TournamentActive     bool
	TournamentMaxOdds    float64
}
