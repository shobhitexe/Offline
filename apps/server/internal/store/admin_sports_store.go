package store

import (
	"context"
	"log"
	"server/internal/models"
)

type AdminSportsStore interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error)
	BetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error)
	FancyBetsPerEventId(ctx context.Context, eventId string) ([]models.FancyBets, error)
	SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error
	GetRunnerResults(ctx context.Context, eventId string) (map[string]int64, error)
	SaveActiveEvents(ctx context.Context, payload models.ListEvents, id string, MatchOdds models.MarketInfo) error
	GetActiveSession(ctx context.Context, eventId string) ([]models.ActiveSession, error)
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
		if err := rows.Scan(&row.Selection, &row.Odds, &row.Stake, &row.PNL, &row.BetType, &row.MarketName, &row.RunnerId, &row.EventId); err != nil {

			log.Println(err)

			return nil, err
		}

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

	query := `SELECT runner_name, odds_rate, bet_type, SUM(exposure) AS total_exposure, SUM(profit) AS total_profit
			  FROM sport_bets 
			  WHERE settled = false 
              AND market_type = 'Fancy' 
              AND event_id = $1
              GROUP BY runner_name, odds_rate, bet_type`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var bet models.FancyBets

		if err := rows.Scan(
			&bet.RunnerName,
			&bet.OddsRate,
			&bet.BetType,
			&bet.TotalExposure,
			&bet.TotalProfit,
		); err != nil {
			return nil, err
		}

		bets = append(bets, bet)

	}

	return bets, nil
}

func (s *adminStore) GetRunnerResults(ctx context.Context, eventId string) (map[string]int64, error) {
	result := make(map[string]int64)

	query := `SELECT runner_id, run FROM runner_results WHERE is_declared = false AND event_id = $1`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var item models.GetRunnerResults

		if err := rows.Scan(&item.RunnerId, &item.Run); err != nil {
			return nil, err
		}

		result[item.RunnerId] = item.Run
	}

	return result, nil
}

func (s *adminStore) SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error {

	query := `INSERT INTO 
	runner_results (event_id, event_name, runner_name, runner_id, run) 
	VALUES ($1, $2, $3, $4, $5)`

	_, err := s.db.Exec(ctx, query, payload.EventId, payload.EventName, payload.RunnerName, payload.RunnerId, payload.Run)

	if err != nil {
		return err
	}

	return nil
}

func (s *adminStore) SaveActiveEvents(ctx context.Context, payload models.ListEvents, id string, MatchOdds models.MarketInfo) error {

	query := `INSERT INTO active_events 
	(sports_id, match_name, event_id, competition_id, runners, match_odds, category, opening_time) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := s.db.Exec(ctx, query, id,
		payload.Event.Name,
		payload.Event.ID,
		payload.Competition.ID,
		payload.Runners,
		MatchOdds,
		payload.Competition.Name,
		payload.Event.OpenDate,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *adminStore) GetActiveSession(ctx context.Context, eventId string) ([]models.ActiveSession, error) {
	var session []models.ActiveSession

	query := `SELECT runner_id, 
       MAX(market_name) AS market_name, 
       MAX(runner_name) AS runner_name,
	   MAX(event_id) AS event_id
       FROM sport_bets
	   WHERE settled = false
	   AND event_id = $1
       GROUP BY runner_id`

	rows, err := s.db.Query(ctx, query, eventId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var item models.ActiveSession
		if err := rows.Scan(&item.RunnerId, &item.MarketName, &item.RunnerName, &item.EventId); err != nil {
			return nil, err
		}
		session = append(session, item)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return session, nil
}
