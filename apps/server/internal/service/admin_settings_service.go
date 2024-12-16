package service

import (
	"context"
	"log"
	"server/internal/models"
)

type AdminSettingsService interface {
	GetSportsSettings(ctx context.Context) ([]models.SportsSettings, error)
	UpdateSportsSettings(ctx context.Context, payload models.SportsSettings) error
	GetTournamentSettings(ctx context.Context, game string) ([]models.TournamentSettings, error)
	GetSingleTournamentSettings(ctx context.Context, id string) (*models.TournamentSettings, error)
	UpdateTournamentSettings(ctx context.Context, payload models.TournamentSettings) error
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

func (s *adminService) GetTournamentSettings(ctx context.Context, game string) ([]models.TournamentSettings, error) {

	settings, err := s.store.GetTournamentSettings(ctx, game)

	if err != nil {
		return nil, err
	}

	return settings, nil
}

func (s *adminService) GetSingleTournamentSettings(ctx context.Context, id string) (*models.TournamentSettings, error) {

	settings, err := s.store.GetSingleTournamentSettings(ctx, id)

	if err != nil {
		return nil, err
	}

	return settings, nil
}

func (s *adminService) UpdateTournamentSettings(ctx context.Context, payload models.TournamentSettings) error {

	if err := s.store.UpdateTournamentSettings(ctx, payload); err != nil {

		log.Println(err)

		return err
	}

	return nil
}
