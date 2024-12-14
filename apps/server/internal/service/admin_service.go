package service

import (
	"context"
	"fmt"
	"server/internal/models"
	"server/internal/store"

	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

type AdminService interface {
	AdminDetails(ctx context.Context, id string) (*models.Admin, error)
	IsAdminBlocked(ctx context.Context, id string) (bool, error)
	ChangeAdminBlockStatus(ctx context.Context, id string, val bool) error
	IsUserBlocked(ctx context.Context, id string) (bool, error)
	ChangeUserBlockStatus(ctx context.Context, id string, val bool) error
	ChangePassword(ctx context.Context, payload models.ChangePassword) error
	AdminAgentService
	AdminWalletService
	AdminUserService
	AdminSportsService
	AdminReportsService
}

type adminService struct {
	store store.AdminStore
	redis *redis.Client
}

func NewAdminService(store store.AdminStore, redis *redis.Client) AdminService {
	return &adminService{store: store, redis: redis}
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

func (s *adminService) ChangePassword(ctx context.Context, payload models.ChangePassword) error {

	p, err := s.store.GetAdminPassword(ctx, payload.ID)

	if err != nil {
		return err
	}

	if len(p) == 0 {
		return fmt.Errorf("Invalid Old Password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(p), []byte(payload.OldPassword))
	if err != nil {
		return fmt.Errorf("Invalid Old Password")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.NewPassword), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	payload.NewPassword = string(hashedPassword)

	if err := s.store.ChangePassword(ctx, payload); err != nil {
		return err
	}

	return nil
}
