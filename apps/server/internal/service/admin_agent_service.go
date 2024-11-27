package service

import (
	"context"
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

	if err := a.store.CreateAgent(ctx, payload); err != nil {
		return err

	}

	return nil
}
