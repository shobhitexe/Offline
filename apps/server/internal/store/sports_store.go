package store

import (
	"context"
	"fmt"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type SportsStore interface {
	GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	PlaceBet(ctx context.Context, payload models.PlaceBet, id string) error
	FindMatchIDByEventID(ctx context.Context, id string) (string, error)
	FindActiveBetsByEventID(ctx context.Context, eventID, runnerID string) (*[]models.ActiveBet, error)
}

type sportsStore struct {
	db *pgxpool.Pool
}

func NewSportsStore(db *pgxpool.Pool) SportsStore {
	return &sportsStore{db: db}
}

func (s *sportsStore) GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var events []models.ActiveEvents

	query := `
	SELECT 
		match_name, 
		event_id, 
		match_type, 
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		sport_books
	WHERE 
		event_type = $1 AND status = 'active'
`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.ActiveEvents
		if err := rows.Scan(&event.MatchName, &event.EventId, &event.MatchType, &event.OpeningTime); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return &events, nil
}

func (s *sportsStore) FindMatchIDByEventID(ctx context.Context, id string) (string, error) {

	var Eventid string

	query := `SELECT id from sport_books WHERE event_id = $1`

	err := s.db.QueryRow(ctx, query, id).Scan(&Eventid)

	if err != nil {
		return "", fmt.Errorf("Failed to find match :%w", err)
	}

	return Eventid, nil
}

func (s *sportsStore) PlaceBet(ctx context.Context, payload models.PlaceBet, id string) error {

	query := `INSERT INTO sport_bets (match_id, event_id, user_id, odds_price, odds_rate, bet_type, bet, market_name, market_id, runner_name, runner_id)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

	_, err := s.db.Exec(ctx, query, id,
		payload.MatchId,
		payload.UserId,
		payload.OddsPrice,
		payload.OddsRate,
		payload.BetType,
		payload.Amount,
		payload.MarketName,
		payload.MarketId,
		payload.RunnerName,
		payload.RunnerID,
	)

	if err != nil {
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
