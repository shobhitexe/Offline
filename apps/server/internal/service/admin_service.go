package service

import (
	"context"
	"errors"
	"log"
	"server/internal/models"
	"server/internal/store"

	"golang.org/x/crypto/bcrypt"
)

type AdminService interface {
	AdminLogin(payload models.AdminLoginRequest, ctx context.Context) (*models.Admin, error)
	AdminAgentService
	AdminWalletService
}

type adminService struct {
	store store.AdminStore
}

func NewAdminService(store store.AdminStore) AdminService {
	return &adminService{store: store}
}

func (a *adminService) AdminLogin(payload models.AdminLoginRequest, ctx context.Context) (*models.Admin, error) {

	admin, err := a.store.GetAdminByUsername(ctx, payload.Username)

	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(payload.Password))
	if err != nil {

		return nil, errors.New("invalid credentials")
	}

	go func() {
		backgroundCtx := context.Background()
		if err := a.store.RecordLoginHistory(backgroundCtx, admin.ID, "admin", payload.LoginIP, payload.UserAgent); err != nil {

			log.Printf("failed to record login history: %v", err)
		}
	}()

	return admin, nil
}
