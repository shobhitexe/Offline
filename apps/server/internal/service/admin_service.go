package service

import (
	"context"
	"server/internal/models"
	"server/internal/store"
)

type AdminService interface {
	AdminDetails(ctx context.Context, id string) (*models.Admin, error)
	IsAdminBlocked(ctx context.Context, id string) (bool, error)
	ChangeAdminBlockStatus(ctx context.Context, id string, val bool) error
	IsUserBlocked(ctx context.Context, id string) (bool, error)
	ChangeUserBlockStatus(ctx context.Context, id string, val bool) error
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

func (s *adminService) IsAdminBlocked(ctx context.Context, id string) (bool, error) {

	b, err := s.store.IsAdminBlocked(ctx, id)

	if err != nil {
		return true, err
	}

	return b, nil
}

func (s *adminService) ChangeAdminBlockStatus(ctx context.Context, id string, val bool) error {

	if err := s.store.ChangeAdminBlockStatus(ctx, id, val); err != nil {
		return err
	}

	return nil
}

func (s *adminService) IsUserBlocked(ctx context.Context, id string) (bool, error) {

	b, err := s.store.IsUserBlocked(ctx, id)

	if err != nil {
		return true, err
	}

	return b, nil
}

func (s *adminService) ChangeUserBlockStatus(ctx context.Context, id string, val bool) error {

	if err := s.store.ChangeUserBlockStatus(ctx, id, val); err != nil {
		return err
	}

	return nil
}
