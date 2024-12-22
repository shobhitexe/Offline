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
	"strconv"
	"sync"
)

type AdminSportsService interface {
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (models.GroupedData, error)
	GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error)
	GetTournamentsList(ctx context.Context, game string) ([]models.TournamentsListData, error)
	GetRunnersofEvent(ctx context.Context, eventId string) ([]models.FancyList, error)
	SetRunnerResult(ctx context.Context, payload models.SetRunnerResultRequest) error
	// SaveActiveEvents(ctx context.Context, sportsid, competitionid, competitionName string) error
	ChangeTournamentStatus(ctx context.Context, payload models.ChangeTournamentStatus) error
	GetOpenMarket(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	ChangeOpenMarketStatus(ctx context.Context, eventId string) error
	GetRunnerHistory(ctx context.Context) ([]models.RunnerHistory, error)
}

func (s *adminService) GetOpenMarket(ctx context.Context, id string) (*[]models.ActiveEvents, error) {

	events, err := s.store.GetOpenMarket(ctx, id)
	if err != nil {
		log.Printf("Error retrieving events from the store: %v", err)
		return nil, err
	}

	return events, nil
}

func (s *adminService) ChangeOpenMarketStatus(ctx context.Context, eventId string) error {

	sportsid, err := s.store.ChangeOpenMarketStatus(ctx, eventId)

	if err != nil {
		return err
	}

	key := "sports:activeEvents:" + strconv.Itoa(sportsid)

	if err := s.redis.Del(ctx, key).Err(); err != nil {
		return err
	}

	return nil
}

func (s *adminService) GetRunnerHistory(ctx context.Context) ([]models.RunnerHistory, error) {

	h, err := s.store.GetRunnerHistory(ctx)

	if err != nil {
		return nil, err
	}

	return h, nil
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

	r, err := s.store.GetSavedRunners(ctx, eventId)

	if err != nil {
		return models.GroupedData{}, err
	}

	matchOddsResults := utils.CalculateActiveBetsOdds(bets, "Match Odds", r)
	bookmakerResults := utils.CalculateActiveBetsOdds(bets, "Bookmaker", r)
	fancyProjections := utils.CalculateActiveFancyBetsProjection(fancyBets)

	grouped := models.GroupedData{
		MatchOdds: matchOddsResults,
		Bookmaker: bookmakerResults,
		Fancy:     fancyProjections,
	}

	return grouped, nil
}

func (s *adminService) GetBetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error) {

	d, err := s.store.BetHistoryPerGame(ctx, eventId)

	if err != nil {
		return nil, models.GroupedData{}, err
	}

	r, err := s.store.GetSavedRunners(ctx, eventId)

	if err != nil {
		return nil, models.GroupedData{}, err
	}

	matchOddsResults := utils.CalculateActiveBetsOdds(d, "Match Odds", r)
	bookmakerResults := utils.CalculateActiveBetsOdds(d, "Bookmaker", r)

	grouped := models.GroupedData{
		MatchOdds: matchOddsResults,
		Bookmaker: bookmakerResults,
	}

	return d, grouped, nil
}

func (s *adminService) GetTournamentsList(ctx context.Context, game string) ([]models.TournamentsListData, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://leisurebuzz.in/api/v2/competition/getList/"+game, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error performing request: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	var list []models.TournamentsListRaw
	if err := json.Unmarshal(body, &list); err != nil {
		return nil, fmt.Errorf("error unmarshalling JSON: %w", err)
	}

	var data []models.TournamentsListData
	var wg sync.WaitGroup
	var errors []error
	var trueStatusData []models.TournamentsListData
	var falseStatusData []models.TournamentsListData

	for _, item := range list {
		wg.Add(1)
		go func(CompetitionID, CompetitionName, competitionRegion string) {
			defer wg.Done()

			s, err := s.store.IsTournamentAutoUpdateEnabled(ctx, CompetitionID)

			if err != nil {
				errors = append(errors, err)
				return
			}

			t := models.TournamentsListData{
				ID:                item.Competition.ID,
				Name:              item.Competition.Name,
				CompetitionRegion: item.CompetitionRegion,
				SportsId:          game,
				Status:            s,
			}
			if s {
				trueStatusData = append(trueStatusData, t)
			} else {
				falseStatusData = append(falseStatusData, t)
			}
		}(item.Competition.ID, item.Competition.Name, item.CompetitionRegion)
	}

	wg.Wait()

	if len(errors) > 0 {
		return nil, fmt.Errorf("errors occurred: %v", errors)
	}

	data = append(trueStatusData, falseStatusData...)

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

	log.Println(results)

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
							log.Println(err)
							errChan <- fmt.Errorf("BetResultLose failed: %w", err)
						}
						if err := s.store.ChangeActiveBetStatus(ctx, tx, result.ID, "loss"); err != nil {
							log.Println(err)
							errChan <- fmt.Errorf("Bet change status Failed: %w", err)
						}
					case result.OddsRate > float64(payload.Run):
						if err := s.store.BetResultWin(goroutineCtx, tx, result.Profit, result.Exposure, result.UserId); err != nil {
							log.Println(err)
							errChan <- fmt.Errorf("BetResultWin failed: %w", err)
						}
						if err := s.store.ChangeActiveBetStatus(ctx, tx, result.ID, "win"); err != nil {
							log.Println(err)
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
		log.Println(finalErr)
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

func (s *adminService) ChangeTournamentStatus(ctx context.Context, payload models.ChangeTournamentStatus) error {

	if payload.Status == true {
		if err := s.saveActiveEvents(ctx, payload.SportsId, payload.CompetitionId, payload.CompetitionName); err != nil {
			return err
		}
	}

	key := "sports:activeEvents:" + payload.SportsId
	if err := s.redis.Del(ctx, key).Err(); err != nil {
		return err
	}

	if err := s.store.ChangeTournamentStatus(ctx, payload.CompetitionId, payload.Status); err != nil {
		return err
	}

	return nil
}

func (s *adminService) saveActiveEvents(ctx context.Context, sportsid, competitionid, competitionName string) error {

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

			var saveRunner []models.SavedRunner

			for _, runner := range event.Runners {

				r := models.SavedRunner{
					RunnerName: runner.RunnerName,
					RunnerId:   runner.MetaData.RunnerId,
				}

				saveRunner = append(saveRunner, r)
			}
			if err := s.store.SaveActiveEvents(ctx, event, saveRunner, sportsid); err != nil {
				log.Printf("Failed to save active event %s: %v", event.Event.ID, err)
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
