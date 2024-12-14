package store

import (
	"context"
	"server/internal/models"
)

type AdminSportsStore interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error)
	BetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error)
	FancyBetsPerEventId(ctx context.Context, eventId string) ([]models.FancyBets, error)
}

func (s *adminStore) GetActiveBetsListByMarketID(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error) {

	var history []models.BetHistoryPerGame

	query := `SELECT 
	runner_name, odds_rate, exposure, profit, bet_type, market_type, runner_id, event_id
	FROM sport_bets WHERE event_id = $1 AND settled = false
	ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var row models.BetHistoryPerGame
		rows.Scan(&row.Selection, &row.Odds, &row.Stake, &row.PNL, &row.BetType, &row.MarketName, &row.RunnerId, &row.EventId)

		history = append(history, row)
	}

	return &history, nil
}

func (s *adminStore) BetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error) {

	var history []models.BetHistoryPerGame

	query := `SELECT 
	runner_name, odds_rate, exposure, profit, bet_type, market_type, runner_id 
	FROM sport_bets WHERE event_id = $1 AND settled = false
	ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var row models.BetHistoryPerGame
		rows.Scan(&row.Selection, &row.Odds, &row.Stake, &row.PNL, &row.BetType, &row.MarketName, &row.RunnerId)

		history = append(history, row)
	}

	return &history, nil
}

func (s *adminStore) FancyBetsPerEventId(ctx context.Context, eventId string) ([]models.FancyBets, error) {

	var bets []models.FancyBets

	query := `SELECT runner_name, odds_rate, SUM(exposure) AS total_exposure, SUM(profit) AS total_profit
			  FROM sport_bets 
			  WHERE settled = false 
              AND market_type = 'Fancy' 
              AND event_id = $1
              GROUP BY runner_name, odds_rate`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var bet models.FancyBets
		rows.Scan(
			&bet.RunnerName,
			&bet.OddsRate,
			&bet.TotalExposure,
			&bet.TotalProfit,
		)

		bets = append(bets, bet)

	}

	return bets, nil
}
