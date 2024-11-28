package service

import (
	"context"
	"fmt"
	"server/internal/models"

	"golang.org/x/crypto/bcrypt"
)

type AdminAgentService interface {
	AgentsList(ctx context.Context) (*[]models.Admin, error)
	CreateAgent(ctx context.Context, payload models.CreateAgent) error
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
