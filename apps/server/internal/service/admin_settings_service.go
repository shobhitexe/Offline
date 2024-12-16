package service

import (
	"context"
	"server/internal/models"
)

type AdminSettingsService interface {
	GetSportsSettings(ctx context.Context) ([]models.SportsSettings, error)
	UpdateSportsSettings(ctx context.Context, payload models.SportsSettings) error
}

func (s *adminService) GetSportsSettings(ctx context.Context) ([]models.SportsSettings, error) {

	settings, err := s.store.GetSportsSettings(ctx)

	if err != nil {
		return nil, err
	}

	return settings, nil
}

func (s *adminService) UpdateSportsSettings(ctx context.Context, payload models.SportsSettings) error {

	if err := s.store.UpdateSportsSettings(ctx, payload); err != nil {
		return err
	}

	return nil
}
