package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	"server/internal/models"

	"golang.org/x/crypto/bcrypt"
)

type AdminAgentService interface {
	AdminLogin(payload models.AdminLoginRequest, ctx context.Context) (*models.Admin, error)
	AgentsList(ctx context.Context) (*[]models.Admin, error)
	CreateAgent(ctx context.Context, payload models.CreateAgent) error
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

func (a *adminService) AgentsList(ctx context.Context) (*[]models.Admin, error) {

	list, err := a.store.GetAgentsList(ctx)

	if err != nil {
		return nil, err
	}

	return list, nil
}

func (a *adminService) CreateAgent(ctx context.Context, payload models.CreateAgent) error {

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

	id, err := a.store.CreateAgent(ctx, tx, payload)

	if err != nil {
		return err
	}

	if len(id) == 0 || id == "" {
		return fmt.Errorf("Empty id : %w", err)
	}

	if err := a.store.TransferBalance(ctx, tx, payload.AddedBy, id, payload.Credit); err != nil {
		return err
	}

	if err := a.store.TransferSportsShare(ctx, tx, payload.AddedBy, id, payload.SportsShare); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
