package models

import "time"

// admin auth
type AdminLoginRequest struct {
	Username  string `json:"username" validate:"required,min=3,max=50"`
	Password  string `json:"password" validate:"required,min=6,max=100"`
	LoginIP   string `json:"loginIp" validate:"required"`
	UserAgent string `json:"userAgent" validate:"required"`
}

type LoginHistory struct {
	ID        string    `json:"id"`
	UserId    string    `json:"userId"`
	UserType  string    `json:"userType"`
	LoginIp   string    `json:"loginIp"`
	UserAgent string    `json:"userAgent"`
	CreatedAt time.Time `json:"createdAt"`
}

// Agent
type CreateAgent struct {
	Name              string  `json:"name" validate:"required"`
	UserName          string  `json:"username" validate:"required,min=3,max=50"`
	Password          string  `json:"password" validate:"required,min=6,max=100"`
	Credit            float64 `json:"credit" validate:"required,gte=0"`
	SportsShare       int64   `json:"sportsShare" validate:"required,gte=0,lte=100"`
	MarketCommission  int64   `json:"marketCommission" validate:"required,gte=0,lte=100"`
	SessionCommission int64   `json:"sessionCommission" validate:"required,gte=0,lte=100"`
	ChildLevel        int64   `json:"childLevel" validate:"required,gte=1,lte=8"`
	AddedBy           string  `json:"addedBy" validate:"required"`
}

// user
type CreateUser struct {
	ID                string  `json:"id"`
	Name              string  `json:"name" validate:"required"`
	Username          string  `json:"username" validate:"required"`
	Password          string  `json:"password" validate:"required,min=6,max=100"`
	Credit            float64 `json:"credit" validate:"required,gte=0"`
	MarketCommission  int64   `json:"marketCommission" validate:"required,gte=0,lte=100"`
	SessionCommission int64   `json:"sessionCommission" validate:"required,gte=0,lte=100"`
	AddedBy           string  `json:"addedBy" validate:"required"`
}

// transfer
type TransferCredit struct {
	Amount  float64 `json:"amount"`
	From    string  `json:"from"`
	To      string  `json:"to"`
	Remarks string  `json:"remarks"`
}

// edit user
type EditUser struct {
	ID               string `json:"id" validate:"required"`
	Name             string `json:"name" validate:"required"`
	MarketCommission int64  `json:"marketCommission" validate:"required,gte=0,lte=100"`
}

// edit admin
type EditAdmin struct {
	ID   string `json:"id" validate:"required"`
	Name string `json:"name" validate:"required"`
}

// change password
type ChangePassword struct {
	ID          string `json:"id" validate:"required"`
	OldPassword string `json:"oldPassword" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required"`
}

// Place bet
type PlaceBet struct {
	MatchId    string  `json:"matchId" validate:"required"`
	UserId     string  `json:"userId" validate:"required"`
	OddsPrice  float64 `json:"oddsPrice" validate:"required"`
	OddsRate   float64 `json:"oddsRate" validate:"required"`
	BetType    string  `json:"betType" validate:"required"`
	Amount     float64 `json:"amount" validate:"required,gte=0"`
	MarketName string  `json:"marketName" validate:"required"`
	MarketId   string  `json:"marketId" validate:"required"`
	RunnerName string  `json:"runnerName" validate:"required"`
	RunnerID   string  `json:"runnerId" validate:"required"`
	MarketType string  `json:"marketType" validate:"required"`
}

// user sign in
type SignInRequest struct {
	CsrfToken string `json:"csrfToken" validate:"required"`
	LoginIP   string `json:"loginIP" validate:"required"`
	Password  string `json:"password" validate:"required"`
	UserAgent string `json:"userAgent" validate:"required"`
	Username  string `json:"username" validate:"required"`
}

// settlement

type SettlementRequest struct {
	Cash     float64 `json:"cash" validate:"required"`
	FromId   string  `json:"fromId" validate:"required"`
	ToId     string  `json:"toId" validate:"required"`
	Remarks  string  `json:"remarks" validate:"required"`
	Password string  `json:"password" validate:"required"`
	TxnType  string  `json:"txnType" validate:"required"`
}

//runners

type SetRunnerResultRequest struct {
	EventId    string `json:"eventId" validate:"required"`
	EventName  string `json:"eventName" validate:"required"`
	RunnerName string `json:"runnerName" validate:"required"`
	RunnerId   string `json:"runnerId" validate:"required"`
	Run        int64  `json:"run" validate:"required,gte=0"`
}

// save events

type SaveActiveEvents struct {
	SportsId        string `json:"sportsid" validate:"required"`
	CompetitionId   string `json:"competitionid" validate:"required"`
	CompetitionName string `json:"CompetitionName" validate:"required"`
}
