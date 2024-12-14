package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"server/internal/models"
	"server/pkg/utils"

	"github.com/redis/go-redis/v9"
)

type AdminSportsService interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error)
	GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error)
	GetTournamentsList(ctx context.Context, game string) ([]models.TournamentsListData, error)
	GetRunnersofEvent(ctx context.Context, eventId string) ([]models.FancyList, error)
	SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error
}

func (s *adminService) GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error) {
	bets, err := s.store.GetActiveBetsListByMarketID(ctx, eventId)
	if err != nil {
		return models.GroupedData{}, err
	}

	fancyBets, err := s.store.FancyBetsPerEventId(ctx, eventId)

	if err != nil {
		return models.GroupedData{}, err
	}

	matchOddsResults := utils.CalculateActiveBetsOdds(bets, "Match Odds")
	bookmakerResults := utils.CalculateActiveBetsOdds(bets, "Bookmaker")

	grouped := models.GroupedData{
		MatchOdds: matchOddsResults,
		Bookmaker: bookmakerResults,
		Fancy:     fancyBets,
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

func (s *adminService) GetRunnersofEvent(ctx context.Context, eventId string) ([]models.FancyList, error) {
	key := `sports:eventDetails:` + eventId

	e, err := s.redis.Get(ctx, key).Result()

	if err == redis.Nil {
		return nil, fmt.Errorf("no value found for key: %s", key)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to fetch key %s from Redis: %v", key, err)
	}

	results, err := s.store.GetRunnerResults(ctx, eventId)

	if err != nil {
		return nil, err
	}

	var data models.Odds
	if err := json.Unmarshal([]byte(e), &data); err != nil {
		return nil, fmt.Errorf("failed to unmarshal Redis value: %v", err)
	}

	var list []models.FancyList

	for _, runner := range data.Fancy.Runners {

		if runner.Status == "true" {
			r := models.FancyList{
				Back:       runner.Back,
				Lay:        runner.Lay,
				RunnerId:   runner.RunnerId,
				RunnerName: runner.RunnerName,
				Status:     runner.Status,
				Eventname:  data.EventName,
				EventId:    data.EventId,
				Run:        results[runner.RunnerId],
			}

			list = append(list, r)
		}

	}

	return list, nil
}

func (s *adminService) SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error {

	if err := s.store.SetRunnerResult(ctx, payload); err != nil {
		return err
	}

	return nil
}
