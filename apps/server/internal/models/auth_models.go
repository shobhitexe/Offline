package models

import "time"

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
