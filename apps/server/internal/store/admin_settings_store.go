package store

import (
	"context"
	"fmt"
	"server/internal/models"
)

type AdminSettingsStore interface {
	GetSportsSettings(ctx context.Context) ([]models.SportsSettings, error)
	UpdateSportsSettings(ctx context.Context, payload models.SportsSettings) error
}

func (s *adminStore) GetSportsSettings(ctx context.Context) ([]models.SportsSettings, error) {

	var settings []models.SportsSettings

	query := `SELECT * FROM sports_settings`

	rows, err := s.db.Query(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var setting models.SportsSettings

		if err := rows.Scan(
			&setting.ID,
			&setting.Name,
			&setting.MaxStake,
			&setting.MinStake,
			&setting.BeforeInPlayMaxStake,
			&setting.BeforeInPlayMinStake,
			&setting.MaxOdds,
			&setting.BetDelay,
		); err != nil {
			return nil, err
		}

		settings = append(settings, setting)

	}

	return settings, nil
}

func (s *adminStore) UpdateSportsSettings(ctx context.Context, payload models.SportsSettings) error {
	query := `
		UPDATE sports_settings
		SET 
			name = $1,
			max_stake = $2,
			min_stake = $3,
			before_max_stake = $4,
			before_min_stake = $5,
			max_odds = $6,
			bet_delay = $7
		WHERE id = $8
	`

	_, err := s.db.Exec(
		ctx,
		query,
		payload.Name,
		payload.MaxStake,
		payload.MinStake,
		payload.BeforeInPlayMaxStake,
		payload.BeforeInPlayMinStake,
		payload.MaxOdds,
		payload.BetDelay,
		payload.ID,
	)

	if err != nil {
		return fmt.Errorf("failed to update sports settings: %w", err)
	}

	return nil
}
