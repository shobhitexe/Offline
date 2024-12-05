package store

import (
	"context"
	"server/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type SportsStore interface {
	GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
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
