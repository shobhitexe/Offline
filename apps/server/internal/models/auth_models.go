package models

type AdminLoginRequest struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	LoginIP   string `json:"loginIp"`
	UserAgent string `json:"userAgent"`
}
