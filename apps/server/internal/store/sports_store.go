package store

import (
	"context"
	"fmt"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SportsStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	PlaceBet(ctx context.Context, tx pgx.Tx, payload models.PlaceBet, id string, profit, exposure float64) error
	FindMatchIDByEventID(ctx context.Context, tx pgx.Tx, id string) (string, error)
	FindMarketOddsBetsByEventID(ctx context.Context, eventID, runnerID, marketId string) (*[]models.ActiveBet, error)
	TransferBetValueToExposure(ctx context.Context, tx pgx.Tx, id string, amount float64) error
	BetResultWin(ctx context.Context, tx pgx.Tx, profit, exposure float64, id string) error
	BetResultLose(ctx context.Context, tx pgx.Tx, exposure float64, userID string) error
	ChangeActiveBetStatus(ctx context.Context, id, result string) error
	BetHistoryPerGamePerUser(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, error)
	GetInPlayEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	FancyBetsPerEventIdSports(ctx context.Context, eventId, userId string) ([]models.FancyBets, error)
	GetActiveFancyBets(ctx context.Context) ([]models.ActiveBet, error)
}

type sportsStore struct {
	*BaseStore
}

func NewSportsStore(db *pgxpool.Pool) SportsStore {
	return &sportsStore{BaseStore: NewBaseStore(db)}
}

func (s *sportsStore) GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var events []models.ActiveEvents

	query := `
	SELECT 
		match_name, 
		event_id,
		competition_id,
		match_odds, 
		category,
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		active_events
	WHERE 
		sports_id = $1 AND is_declared = false`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {

		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.ActiveEvents
		if err := rows.Scan(
			&event.EventName,
			&event.EventId,
			&event.CompetitionId,
			&event.MatchOdds,
			&event.Category,
			&event.EventTime,
		); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return &events, nil
}

func (s *sportsStore) GetInPlayEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var events []models.ActiveEvents

	query := `
	SELECT 
		match_name, 
		event_id,
		competition_id,
		match_odds, 
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		active_events
	WHERE 
		sports_id = $1 
		AND is_declared = false
		AND NOW() > opening_time`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {

		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.ActiveEvents
		if err := rows.Scan(&event.EventName, &event.EventId, &event.CompetitionId, &event.MatchOdds, &event.EventTime); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return &events, nil
}

func (s *sportsStore) FindMatchIDByEventID(ctx context.Context, tx pgx.Tx, id string) (string, error) {

	var Eventid string

	query := `SELECT id from active_events WHERE event_id = $1`

	err := tx.QueryRow(ctx, query, id).Scan(&Eventid)

	if err != nil {
		return "", fmt.Errorf("Failed to find match :%w", err)
	}

	return Eventid, nil
}

func (s *sportsStore) TransferBetValueToExposure(ctx context.Context, tx pgx.Tx, id string, amount float64) error {

	query := `
	UPDATE users 
	SET exposure = exposure + $1,
	balance = balance - $1
	WHERE id = $2 AND balance >= $1
`

	result, err := tx.Exec(ctx, query, amount, id)
	if err != nil {
		return fmt.Errorf("failed to debit balance: %w", err)
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return fmt.Errorf("insufficient balance for debit operation")
	}

	return nil

}

func (s *sportsStore) PlaceBet(ctx context.Context, tx pgx.Tx, payload models.PlaceBet, id string, profit, exposure float64) error {

	query := `INSERT INTO sport_bets 
	(match_id, event_id, user_id, odds_price, odds_rate, bet_type, market_name, market_id, runner_name, runner_id, market_type, profit, exposure)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`

	_, err := s.db.Exec(ctx, query, id,
		payload.MatchId,
		payload.UserId,
		payload.OddsPrice,
		payload.OddsRate,
		payload.BetType,
		payload.MarketName,
		payload.MarketId,
		payload.RunnerName,
		payload.RunnerID,
		payload.MarketType,
		profit,
		exposure,
	)

	if err != nil {
		log.Println(err)
		return fmt.Errorf("Failed to save bet :%w", err)
	}

	return nil
}

func (s *sportsStore) FindMarketOddsBetsByEventID(ctx context.Context, eventID, runnerID, marketId string) (*[]models.ActiveBet, error) {

	var allbets []models.ActiveBet

	query := `SELECT 
	id, match_id, event_id, user_id, odds_price, odds_rate, bet_type, market_name, market_id, runner_name, runner_id, profit, exposure 
	from sport_bets
	WHERE event_id = $1 AND runner_id = $2 AND market_id = $3 AND settled = false AND market_type = 'Match Odds'`

	bets, err := s.db.Query(ctx, query, eventID, runnerID, marketId)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	for bets.Next() {

		var bet models.ActiveBet

		if err := bets.Scan(
			&bet.ID,
			&bet.MatchId,
			&bet.EventId,
			&bet.UserId,
			&bet.OddsPrice,
			&bet.OddsRate,
			&bet.BetType,
			&bet.MarketName,
			&bet.MarketId,
			&bet.RunnerName,
			&bet.RunnerID,
			&bet.Profit,
			&bet.Exposure,
		); err != nil {
			log.Println(err)

			return nil, err
		}

		allbets = append(allbets, bet)

	}

	return &allbets, nil
}

func (s *sportsStore) BetResultWin(ctx context.Context, tx pgx.Tx, profit, exposure float64, userID string) error {
	query := `UPDATE users SET settlement = settlement + $1, exposure = exposure - $2 WHERE id = $3`
	if _, err := s.db.Exec(ctx, query, profit, exposure, userID); err != nil {
		return fmt.Errorf("failed to update settlement and exposure for user %s: %w", userID, err)
	}

	return nil
}

func (s *sportsStore) BetResultLose(ctx context.Context, tx pgx.Tx, exposure float64, userID string) error {
	query := `UPDATE users SET exposure = exposure - $1, settlement = settlement - $1 WHERE id = $2`
	if _, err := s.db.Exec(ctx, query, exposure, userID); err != nil {
		return fmt.Errorf("failed to update balance and exposure for user %s: %w", userID, err)
	}
	return nil
}

func (s *sportsStore) ChangeActiveBetStatus(ctx context.Context, id, result string) error {

	query := `UPDATE sport_bets SET settled = true, result = $1 WHERE id = $2`

	if _, err := s.db.Exec(ctx, query, result, id); err != nil {
		return fmt.Errorf("failed to status for bet %s: %w", id, err)

	}

	return nil
}

func (s *sportsStore) BetHistoryPerGamePerUser(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, error) {

	var history []models.BetHistoryPerGame

	query := `SELECT 
	runner_name, odds_rate, exposure, profit, bet_type, market_type, runner_id, event_id 
	FROM sport_bets WHERE user_id = $1 AND event_id = $2 AND settled = false
	ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query, userId, eventId)

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

func (s *sportsStore) FancyBetsPerEventIdSports(ctx context.Context, eventId, userId string) ([]models.FancyBets, error) {

	var bets []models.FancyBets

	query := `SELECT runner_name, odds_rate, bet_type, SUM(exposure) AS total_exposure, SUM(profit) AS total_profit
			  FROM sport_bets 
			  WHERE settled = false 
              AND market_type = 'Fancy' 
              AND event_id = $1
			  AND user_id = $2
              GROUP BY runner_name, odds_rate, bet_type`

	rows, err := s.db.Query(ctx, query, eventId, userId)

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

func (s *sportsStore) GetActiveFancyBets(ctx context.Context) ([]models.ActiveBet, error) {

	var bets []models.ActiveBet

	query := `SELECT 
	id, match_id, event_id, user_id, odds_price, odds_rate, bet_type, market_name, market_id, runner_name, runner_id, profit, exposure 
	from sport_bets
	WHERE settled = false AND market_type = 'Fancy'`

	rows, err := s.db.Query(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {

		var item models.ActiveBet

		if err := rows.Scan(); err != nil {
			return nil, err
		}

		bets = append(bets, item)
	}

	return bets, nil
}
