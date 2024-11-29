package service

import (
	"context"
	"fmt"
	"server/internal/models"

	"golang.org/x/crypto/bcrypt"
)

type AdminUserService interface {
	CreateUser(ctx context.Context, payload models.CreateUser) error
	UsersList(ctx context.Context) (*[]models.User, error)
}

func (a *adminService) CreateUser(ctx context.Context, payload models.CreateUser) error {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	payload.Password = string(hashedPassword)

	tx, err := a.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		} else if err != nil {
			_ = tx.Rollback(ctx)
		}
	}()

	if err := a.store.CreateUser(ctx, tx, payload); err != nil {
		return fmt.Errorf("Failed to create user :%w", err)
	}

	if err := a.store.DebitBalance(ctx, tx, payload.AddedBy, payload.Credit); err != nil {
		return fmt.Errorf("Failed to deduct balance :%w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil

}

func (a *adminService) UsersList(ctx context.Context) (*[]models.User, error) {

	list, err := a.store.GetUsersList(ctx)

	if err != nil {
		return nil, err
	}

	return list, nil
}
