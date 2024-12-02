package service

import (
	"context"
	"server/internal/models"
	"server/internal/store"
)

type AdminService interface {
	AdminDetails(ctx context.Context, id string) (*models.Admin, error)
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

func (s *adminService) AdminDetails(ctx context.Context, id string) (*models.Admin, error) {

	admin, err := s.store.AdminDetails(ctx, id)

	if err != nil {
		return nil, err
	}

	return admin, nil

}
