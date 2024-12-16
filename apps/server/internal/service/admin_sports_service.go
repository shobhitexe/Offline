package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"server/internal/models"
	"server/pkg/utils"
	"sync"
)

type AdminSportsService interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error)
	GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error)
	GetTournamentsList(ctx context.Context, game string) ([]models.TournamentsListData, error)
	GetRunnersofEvent(ctx context.Context, eventId string) ([]models.FancyList, error)
	SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error
	SaveActiveEvents(ctx context.Context, sportsid, competitionid, competitionName string) error
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
			SportsId:          game,
		}

		data = append(data, t)
	}

	return data, nil
}

func (s *adminService) GetRunnersofEvent(ctx context.Context, eventId string) ([]models.FancyList, error) {

	results, err := s.store.GetRunnerResults(ctx, eventId)

	if err != nil {
		return nil, err
	}

	session, err := s.store.GetActiveSession(ctx, eventId)

	if err != nil {
		return nil, err
	}

	var list []models.FancyList

	for _, item := range session {

		r := models.FancyList{
			RunnerName: item.RunnerName,
			Eventname:  item.MarketName,
			RunnerId:   item.RunnerId,
			EventId:    item.EventId,
			Run:        results[item.RunnerId],
		}

		list = append(list, r)

	}

	return list, nil
}

func (s *adminService) SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error {

	results, err := s.store.GetActiveFancyBets(ctx, payload.EventId)
	if err != nil {
		return err
	}

	tx, err := s.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	var finalErr error
	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		} else if finalErr != nil {
			_ = tx.Rollback(ctx)
		}
	}()

	errChan := make(chan error, len(results))
	defer close(errChan)

	var wg sync.WaitGroup

	for _, result := range results {
		wg.Add(1)
		go func(result models.ActiveBet) {
			defer wg.Done()

			goroutineCtx := ctx

			if result.RunnerID == payload.RunnerId {
				if result.BetType == "no" {
					switch {
					case result.OddsRate <= float64(payload.Run):
						if err := s.store.BetResultLose(goroutineCtx, tx, result.Exposure, result.UserId); err != nil {
							errChan <- fmt.Errorf("BetResultLose failed: %w", err)
						}
						if err := s.store.ChangeActiveBetStatus(ctx, tx, result.ID, "loss"); err != nil {
							errChan <- fmt.Errorf("Bet change status Failed: %w", err)
						}
					case result.OddsRate > float64(payload.Run):
						if err := s.store.BetResultWin(goroutineCtx, tx, result.Profit, result.Exposure, result.UserId); err != nil {
							errChan <- fmt.Errorf("BetResultWin failed: %w", err)
						}
						if err := s.store.ChangeActiveBetStatus(ctx, tx, result.ID, "win"); err != nil {
							errChan <- fmt.Errorf("Bet change status Failed: %w", err)
						}
					}
				}

				if result.BetType == "yes" {
					switch {
					case result.OddsRate <= float64(payload.Run):
						if err := s.store.BetResultWin(goroutineCtx, tx, result.Profit, result.Exposure, result.UserId); err != nil {
							errChan <- fmt.Errorf("BetResultWin failed: %w", err)
						}
						if err := s.store.ChangeActiveBetStatus(ctx, tx, result.ID, "win"); err != nil {
							errChan <- fmt.Errorf("Bet change status Failed: %w", err)
						}
					case result.OddsRate > float64(payload.Run):
						if err := s.store.BetResultLose(goroutineCtx, tx, result.Exposure, result.UserId); err != nil {
							errChan <- fmt.Errorf("BetResultLose failed: %w", err)
						}
						if err := s.store.ChangeActiveBetStatus(ctx, tx, result.ID, "loss"); err != nil {
							errChan <- fmt.Errorf("Bet change status Failed: %w", err)
						}
					}
				}
			}
		}(result)
	}

	wg.Wait()

	select {
	case finalErr = <-errChan:
		return finalErr
	default:
	}

	if err := s.store.SaveRunnerResultHistory(ctx, payload); err != nil {
		return fmt.Errorf("failed to save runner result history: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (s *adminService) SaveActiveEvents(ctx context.Context, sportsid, competitionid, competitionName string) error {

	if err := s.store.InitTournamentSettings(ctx, competitionid, sportsid, competitionName); err != nil {
		return err
	}

	r, err := http.Get("https://leisurebuzz.in/api/v2/competition/listEvents/" + sportsid + "/" + competitionid)
	if err != nil {
		return fmt.Errorf("failed to fetch events: %w", err)
	}
	defer r.Body.Close()

	if r.StatusCode != http.StatusOK {
		return fmt.Errorf("error: invalid status code %d returned", r.StatusCode)
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading response body for competition %s: %v", competitionid, err)
		return err
	}

	var events []models.ListEvents
	if err := json.Unmarshal(body, &events); err != nil {
		return fmt.Errorf("failed to unmarshal events: %w", err)
	}

	var wg sync.WaitGroup
	var errors []error

	for _, event := range events {
		wg.Add(1)
		go func(e models.ListEvents) {
			defer wg.Done()
			if err := saveMarketOdds(ctx, e, sportsid, s); err != nil {
				errors = append(errors, err)
			}
		}(event)
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		key := "sports:activeEvents:" + sportsid
		if err := s.redis.Del(ctx, key).Err(); err != nil {
			errors = append(errors, err)
		}
	}()

	wg.Wait()

	if len(errors) > 0 {
		for _, err := range errors {
			return err
		}
		return err
	}

	return nil
}

func saveMarketOdds(ctx context.Context, event models.ListEvents, sportsid string, s *adminService) error {
	res, err := http.Get("https://alp.playunlimited9.co.in/api/v2/competition/getEventDetail/" + event.Event.ID)
	if err != nil {
		return fmt.Errorf("failed to fetch event details: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code %d for event %s", res.StatusCode, event.Event.ID)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("error reading response body for event %s: %w", event.Event.ID, err)
	}

	var payload models.Odds
	if err := json.Unmarshal(body, &payload); err != nil {
		return fmt.Errorf("failed to unmarshal odds for event %s: %w", event.Event.ID, err)
	}

	if err := s.store.SaveActiveEvents(ctx, event, sportsid, payload.MatchOdds); err != nil {
		log.Printf("Failed to save active event %s: %v", event.Event.ID, err)
		return fmt.Errorf("failed to save active event %s: %w", event.Event.ID, err)
	}

	return nil
}
