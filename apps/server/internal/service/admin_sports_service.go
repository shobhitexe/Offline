package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"server/internal/models"
	"server/pkg/utils"
)

type AdminSportsService interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error)
	GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error)
	GetTournamentsList(ctx context.Context, game string) ([]models.TournamentsListData, error)
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

func (s *adminService) GetTournamentsList(ctx context.Context, game string) ([]models.TournamentsListData, error) {

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://leisurebuzz.in/api/v2/competition/getList/"+game, nil)

	if err != nil {
		return nil, nil
	}

	client := &http.Client{}
	res, err := client.Do(req)

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Unexpected status code %d", res.StatusCode)

	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("Error reading response body for event: %v", err)
	}

	var list []models.TournamentsListRaw

	if err := json.Unmarshal(body, &list); err != nil {
		return nil, err

	}

	var data []models.TournamentsListData

	for _, item := range list {
		t := models.TournamentsListData{
			ID:                item.Competition.ID,
			Name:              item.Competition.Name,
			CompetitionRegion: item.CompetitionRegion,
		}

		data = append(data, t)
	}

	return data, nil
}
