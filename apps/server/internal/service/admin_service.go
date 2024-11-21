package service

import (
	"context"
	"errors"
	"server/internal/models"
	"server/internal/store"

	"golang.org/x/crypto/bcrypt"
)

type AdminService interface {
	AdminLogin(payload models.AdminLoginRequest, ctx context.Context) (*models.Admin, error)
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

	return admin, nil
}
