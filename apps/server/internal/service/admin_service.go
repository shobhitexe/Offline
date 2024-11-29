package service

import (
	"server/internal/store"
)

type AdminService interface {
	AdminAgentService
	AdminWalletService
	AdminUserService
}

type adminService struct {
	store store.AdminStore
}

func NewAdminService(store store.AdminStore) AdminService {
	return &adminService{store: store}
}
