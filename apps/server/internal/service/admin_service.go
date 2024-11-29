package service

import (
	"net/http"
	"server/internal/store"
)

type AdminService interface {
	AdminAgentService
	AdminWalletService
	AdminUserService
}

type adminService struct {
	store  store.AdminStore
	client *http.Client
}

func NewAdminService(store store.AdminStore, client *http.Client) AdminService {
	return &adminService{store: store, client: client}
}
