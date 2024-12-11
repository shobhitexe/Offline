package service

import (
	"context"
	"server/internal/models"
	"server/pkg/utils"
)

type AdminSportsService interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error)
	GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error)
}

func (s *adminService) GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error) {
	bets, err := s.store.GetActiveBetsListByMarketID(ctx, eventId)
	if err != nil {
		return models.GroupedData{}, err
	}

	matchOddsResults := utils.CalculateActiveBetsOdds(bets, "Match Odds")
	bookmakerResults := utils.CalculateActiveBetsOdds(bets, "Bookmaker")

	grouped := models.GroupedData{
		MatchOdds: matchOddsResults,
		Bookmaker: bookmakerResults,
	}

	return grouped, nil
}

func (s *adminService) GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error) {

	d, err := s.store.BetHistoryPerGame(ctx, eventId)

	if err != nil {
		return nil, models.GroupedData{}, err
	}

	matchOddsResults := utils.CalculateActiveBetsOdds(d, "Match Odds")
	bookmakerResults := utils.CalculateActiveBetsOdds(d, "Bookmaker")

	grouped := models.GroupedData{
		MatchOdds: matchOddsResults,
		Bookmaker: bookmakerResults,
	}

	return d, grouped, nil
}
