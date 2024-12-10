package service

import (
	"context"
)

type AdminSportsService interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId, marketId string) (map[string]map[string]float64, error)
}

func (s *adminService) GetActiveBetsListByMarketID(ctx context.Context, eventId, marketId string) (map[string]map[string]float64, error) {
	bets, err := s.store.GetActiveBetsListByMarketID(ctx, eventId, marketId)
	if err != nil {
		return nil, err
	}

	result := make(map[string]map[string]float64)

	for _, bet := range *bets {
		if _, exists := result[bet.MarketType]; !exists {
			result[bet.MarketType] = make(map[string]float64)
		}

		if bet.BetType == "back" {
			result[bet.MarketType][bet.Team] += bet.Exposure
		} else if bet.BetType == "lay" {
			result[bet.MarketType][bet.Team] -= bet.Exposure
		}
	}

	return result, nil
}
