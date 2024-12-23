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

	AddedByName     string  `json:"addedByName"`
	AddedByUserName string  `json:"addedByUsername"`
	AddedByBalance  float64 `json:"addedByBalance"`
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

type CombinedMatchSettings struct {
	TournamentName       string  `json:"tournamentName"`
	MaxStake             float64 `json:"maxStake"`
	MinStake             float64 `json:"minStake"`
	BeforeInPlayMaxStake float64 `json:"beforeInPlayMaxStake"`
	BeforeInPlayMinStake float64 `json:"beforeInPlayMinStake"`
	BetDelay             string  `json:"betDelay"`
	Active               bool    `json:"active"`
	PreMOStakesMin       float64 `json:"preMOStakesMin"`
	PreMOStakesMax       float64 `json:"preMOStakesMax"`
	PostMOStakesMin      float64 `json:"postMOStakesMin"`
	PostMOStakesMax      float64 `json:"postMOStakesMax"`
	PreBMStakesMin       float64 `json:"preBMStakesMin"`
	PreBMStakesMax       float64 `json:"preBMStakesMax"`
	PostBMStakesMin      float64 `json:"postBMStakesMin"`
	PostBMStakesMax      float64 `json:"postBMStakesMax"`
	PreFancyStakesMin    float64 `json:"preFancyStakesMin"`
	PreFancyStakesMax    float64 `json:"preFancyStakesMax"`
	PostFancyStakesMin   float64 `json:"postFancyStakesMin"`
	PostFancyStakesMax   float64 `json:"postFancyStakesMax"`
	TossStakesMin        float64 `json:"tossStakesMin"`
	TossStakesMax        float64 `json:"tossStakesMax"`
	BetDelayMO           string  `json:"betDelayMO"`
	BetDelayBM           string  `json:"betDelayBM"`
	BetDelayTO           string  `json:"betDelayTO"`
	BetDelayFA           string  `json:"betDelayFA"`
	MaxProfitMO          float64 `json:"maxProfitMO"`
	MaxProfitBM          float64 `json:"maxProfitBM"`
	MaxProfitTO          float64 `json:"maxProfitTO"`
	MaxProfitFA          float64 `json:"maxProfitFA"`
	MaxOdds              float64 `json:"maxOdds"`
}
