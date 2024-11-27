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
	Name              string `json:"name" validate:"required"`
	UserName          string `json:"username" validate:"required,min=3,max=50"`
	Password          string `json:"password" validate:"required,min=6,max=100"`
	Credit            int64  `json:"credit" validate:"required,gte=0"`
	SportsShare       int64  `json:"sportsShare" validate:"required,gte=0,lte=100"`
	MarketCommission  int64  `json:"marketCommission" validate:"required,gte=0,lte=100"`
	SessionCommission int64  `json:"sessionCommission" validate:"required,gte=0,lte=100"`
	ChildLevel        int64  `json:"childLevel" validate:"required,gte=1,lte=8"`
	AddedBy           string `json:"addedBy" validate:"required"`
}
