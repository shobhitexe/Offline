package store

import (
	"context"
	"log"
	"server/internal/models"
)

type AdminSportsStore interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId, marketId string) (*[]models.ActiveExposureByTeam, error)
}

func (s *adminStore) GetActiveBetsListByMarketID(ctx context.Context, eventId, marketId string) (*[]models.ActiveExposureByTeam, error) {

	var list []models.ActiveExposureByTeam

	query := `SELECT runner_name, exposure, bet_type, market_type
	FROM sport_bets 
	WHERE event_id = $1 AND market_id = $2`

	rows, err := s.db.Query(ctx, query, eventId, marketId)

	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var bet models.ActiveExposureByTeam
		if err := rows.Scan(&bet.Team, &bet.Exposure, &bet.BetType, &bet.MarketType); err != nil {
			return nil, err
		}
		list = append(list, bet)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &list, nil
}
