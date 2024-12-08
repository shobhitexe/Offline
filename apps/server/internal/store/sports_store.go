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
	FindActiveBetsByEventID(ctx context.Context, eventID, runnerID string) (*[]models.ActiveBet, error)
	SaveActiveEvents(ctx context.Context, payload models.ActiveEvents) error
	TransferUserBalanceToExposure(ctx context.Context, tx pgx.Tx, id string, amount float64) error
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
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		active_events
	WHERE 
		sports_id = $1 AND status = 'active'
`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.ActiveEvents
		if err := rows.Scan(&event.EventName, &event.EventId, &event.EventTime); err != nil {
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

func (s *sportsStore) TransferUserBalanceToExposure(ctx context.Context, tx pgx.Tx, id string, amount float64) error {

	query := `
	UPDATE users 
	SET balance = balance - $1, exposure = exposure + $1 
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

func (s *sportsStore) FindActiveBetsByEventID(ctx context.Context, eventID, runnerID string) (*[]models.ActiveBet, error) {

	var allbets []models.ActiveBet

	query := `SELECT id, match_id, event_id, user_id, odds_price, odds_rate, bet_type, bet, market_name, market_id, runner_name, runner_id from sport_bets
	WHERE event_id = $1 AND runner_id = $2 AND settled = false`

	bets, err := s.db.Query(ctx, query, eventID, runnerID)

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
			&bet.Amount,
			&bet.MarketName,
			&bet.MarketId,
			&bet.RunnerName,
			&bet.RunnerID,
		); err != nil {
			log.Println(err)

			return nil, err
		}

		allbets = append(allbets, bet)

	}

	return &allbets, nil
}

func (s *sportsStore) SaveActiveEvents(ctx context.Context, payload models.ActiveEvents) error {

	query := `INSERT INTO active_events (sports_id, match_name, event_id, competition_id, opening_time) 
	VALUES ($1, $2, $3, $4, $5)`

	_, err := s.db.Exec(ctx, query, 4, payload.EventName, payload.EventId, payload.CompetitionId, payload.EventTime)

	if err != nil {
		return err
	}

	return nil
}
