package store

import (
	"context"
	"fmt"
	"server/internal/models"
)

type AdminSettingsStore interface {
	GetSportsSettings(ctx context.Context) ([]models.SportsSettings, error)
	UpdateSportsSettings(ctx context.Context, payload models.SportsSettings) error
	GetTournamentSettings(ctx context.Context, game string) ([]models.TournamentSettings, error)
	GetSingleTournamentSettings(ctx context.Context, game string) (*models.TournamentSettings, error)
	UpdateTournamentSettings(ctx context.Context, payload models.TournamentSettings) error
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

func (s *adminStore) GetTournamentSettings(ctx context.Context, game string) ([]models.TournamentSettings, error) {

	var settings []models.TournamentSettings

	query := `SELECT id, tournament_name, sports_id,
		pre_mo_stakes_min, pre_mo_stakes_max, 
		post_mo_stakes_min, post_mo_stakes_max, 
		pre_bm_stakes_min, pre_bm_stakes_max, 
		post_bm_stakes_min, post_bm_stakes_max, 
		pre_fancy_stakes_min, pre_fancy_stakes_max, 
		post_fancy_stakes_min, post_fancy_stakes_max, 
		toss_stakes_min, toss_stakes_max,
		bet_delay_mo, bet_delay_bm, bet_delay_to, bet_delay_fa,
		max_profit_mo, max_profit_bm, max_profit_to, max_profit_fa, 
		max_odds, active 
		FROM tournament_settings WHERE sports_id = $1`

	rows, err := s.db.Query(ctx, query, game)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var setting models.TournamentSettings

		if err := rows.Scan(
			&setting.ID,
			&setting.TournamentName,
			&setting.SportsID,
			&setting.PreMOStakesMin,
			&setting.PreMOStakesMax,
			&setting.PostMOStakesMin,
			&setting.PostMOStakesMax,
			&setting.PreBMStakesMin,
			&setting.PreBMStakesMax,
			&setting.PostBMStakesMin,
			&setting.PostBMStakesMax,
			&setting.PreFancyStakesMin,
			&setting.PreFancyStakesMax,
			&setting.PostFancyStakesMin,
			&setting.PostFancyStakesMax,
			&setting.TossStakesMin,
			&setting.TossStakesMax,
			&setting.BetDelayMO,
			&setting.BetDelayBM,
			&setting.BetDelayTO,
			&setting.BetDelayFA,
			&setting.MaxProfitMO,
			&setting.MaxProfitBM,
			&setting.MaxProfitTO,
			&setting.MaxProfitFA,
			&setting.MaxOdds,
			&setting.Active,
		); err != nil {
			return nil, err
		}

		settings = append(settings, setting)
	}

	return settings, nil
}

func (s *adminStore) GetSingleTournamentSettings(ctx context.Context, game string) (*models.TournamentSettings, error) {

	var setting models.TournamentSettings

	query := `SELECT id, tournament_name, sports_id,
		pre_mo_stakes_min, pre_mo_stakes_max, 
		post_mo_stakes_min, post_mo_stakes_max, 
		pre_bm_stakes_min, pre_bm_stakes_max, 
		post_bm_stakes_min, post_bm_stakes_max, 
		pre_fancy_stakes_min, pre_fancy_stakes_max, 
		post_fancy_stakes_min, post_fancy_stakes_max, 
		toss_stakes_min, toss_stakes_max,
		bet_delay_mo, bet_delay_bm, bet_delay_to, bet_delay_fa,
		max_profit_mo, max_profit_bm, max_profit_to, max_profit_fa, 
		max_odds, active 
		FROM tournament_settings WHERE id = $1`

	err := s.db.QueryRow(ctx, query, game).Scan(
		&setting.ID,
		&setting.TournamentName,
		&setting.SportsID,
		&setting.PreMOStakesMin,
		&setting.PreMOStakesMax,
		&setting.PostMOStakesMin,
		&setting.PostMOStakesMax,
		&setting.PreBMStakesMin,
		&setting.PreBMStakesMax,
		&setting.PostBMStakesMin,
		&setting.PostBMStakesMax,
		&setting.PreFancyStakesMin,
		&setting.PreFancyStakesMax,
		&setting.PostFancyStakesMin,
		&setting.PostFancyStakesMax,
		&setting.TossStakesMin,
		&setting.TossStakesMax,
		&setting.BetDelayMO,
		&setting.BetDelayBM,
		&setting.BetDelayTO,
		&setting.BetDelayFA,
		&setting.MaxProfitMO,
		&setting.MaxProfitBM,
		&setting.MaxProfitTO,
		&setting.MaxProfitFA,
		&setting.MaxOdds,
		&setting.Active,
	)
	if err != nil {
		return nil, err
	}

	return &setting, nil
}

func (s *adminStore) UpdateTournamentSettings(ctx context.Context, payload models.TournamentSettings) error {

	query := `
		UPDATE tournament_settings
		SET
			tournament_name = $1,
			pre_mo_stakes_min = $2,
			pre_mo_stakes_max = $3,
			post_mo_stakes_min = $4,
			post_mo_stakes_max = $5,
			pre_bm_stakes_min = $6,
			pre_bm_stakes_max = $7,
			post_bm_stakes_min = $8,
			post_bm_stakes_max = $9,
			pre_fancy_stakes_min = $10,
			pre_fancy_stakes_max = $11,
			post_fancy_stakes_min = $12,
			post_fancy_stakes_max = $13,
			toss_stakes_min = $14,
			toss_stakes_max = $15,
			bet_delay_mo = $16,
			bet_delay_bm = $17,
			bet_delay_to = $18,
			bet_delay_fa = $19,
			max_profit_mo = $20,
			max_profit_bm = $21,
			max_profit_to = $22,
			max_profit_fa = $23,
			max_odds = $24,
			active = true
		WHERE id = $25`

	if _, err := s.db.Exec(ctx, query,
		payload.TournamentName,
		payload.PreMOStakesMin,
		payload.PreMOStakesMax,
		payload.PostMOStakesMin,
		payload.PostMOStakesMax,
		payload.PreBMStakesMin,
		payload.PreBMStakesMax,
		payload.PostBMStakesMin,
		payload.PostBMStakesMax,
		payload.PreFancyStakesMin,
		payload.PreFancyStakesMax,
		payload.PostFancyStakesMin,
		payload.PostFancyStakesMax,
		payload.TossStakesMin,
		payload.TossStakesMax,
		payload.BetDelayMO,
		payload.BetDelayBM,
		payload.BetDelayTO,
		payload.BetDelayFA,
		payload.MaxProfitMO,
		payload.MaxProfitBM,
		payload.MaxProfitTO,
		payload.MaxProfitFA,
		payload.MaxOdds,
		payload.ID,
	); err != nil {
		return err
	}
	return nil
}
