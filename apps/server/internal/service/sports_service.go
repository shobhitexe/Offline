package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"server/internal/models"
	"server/internal/store"
	"server/pkg/utils"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
)

type SportsService interface {
	// GetList(id string) (interface{}, error)
	// ListEvents(sportsId, competitionId string) (interface{}, error)
	// GetMarketList(id string) (interface{}, error)
	GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	GetEventDetail(ctx context.Context, eventId string) (map[string]interface{}, error)
	PlaceBet(ctx context.Context, payload models.PlaceBet) error
	BetHistoryPerGame(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error)
	GetInPlayEvents(ctx context.Context) (*[]models.ActiveEvents, *[]models.ActiveEvents, *[]models.ActiveEvents, error)
	GetAllEvents(ctx context.Context) (*[]models.ActiveEvents, *[]models.ActiveEvents, *[]models.ActiveEvents, error)
	GetMatchSettings(ctx context.Context, sportsId, competitionId string) (*models.CombinedMatchSettings, error)
	GetMatchOdds(ctx context.Context, eventId string) (*models.MarketInfo, error)
}

type sportsService struct {
	store store.SportsStore
	redis *redis.Client
}

func NewSportsService(store store.SportsStore, redis *redis.Client) SportsService {
	return &sportsService{
		store: store,
		redis: redis,
	}
}

func (s *sportsService) GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var jsonData []models.ActiveEvents
	key := "sports:activeEvents:" + id

	r, err := s.redis.Get(ctx, key).Result()
	if err == nil {
		if err := json.Unmarshal([]byte(r), &jsonData); err != nil {
			log.Printf("Error unmarshaling cached data from Redis: %v", err)
			return nil, err
		}

		if err := s.redis.Expire(ctx, key, 1*time.Hour).Err(); err != nil {
			log.Printf("Error extending expiration time for key %s: %v", key, err)
		}
		return &jsonData, nil
	}

	if err != redis.Nil {
		log.Printf("Error retrieving from Redis: %v", err)
	}

	events, err := s.store.GetActiveEvents(ctx, id)
	if err != nil {
		log.Printf("Error retrieving events from the store: %v", err)
		return nil, err
	}

	serializedEvents, err := json.Marshal(events)
	if err != nil {
		log.Printf("Error marshaling events for Redis: %v", err)
		return nil, err
	}

	if err := s.redis.Set(ctx, key, serializedEvents, 1*time.Hour).Err(); err != nil {
		log.Printf("Error storing data in Redis: %v", err)
	}

	return events, nil
}

func (s *sportsService) GetEventDetail(ctx context.Context, eventId string) (map[string]interface{}, error) {
	key := "sports:eventDetails:" + eventId

	ev, err := s.redis.Get(ctx, key).Result()
	if err == redis.Nil {
		log.Printf("Key not found in Redis: %s", key)
		return nil, nil
	}
	if err != nil {
		log.Printf("Error fetching key from Redis: %s, error: %v", key, err)
		return nil, err
	}

	var jsonData map[string]interface{}
	if err := json.Unmarshal([]byte(ev), &jsonData); err != nil {
		log.Printf("Error unmarshaling JSON for key: %s, error: %v", key, err)
		return nil, err
	}

	return jsonData, nil
}

func (s *sportsService) PlaceBet(ctx context.Context, payload models.PlaceBet) error {

	tx, err := s.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		} else if err != nil {
			_ = tx.Rollback(ctx)
		}
	}()

	id, err := s.store.FindMatchIDByEventID(ctx, tx, payload.MatchId)

	if err != nil {
		return fmt.Errorf("Failed to find match id :%w", err)
	}

	// price, rate, err := getPriceAndOdds(payload.MatchId, payload.RunnerID, payload.MarketType, payload.BetType)

	if payload.OddsPrice == 0 || payload.OddsRate == 0 {
		return fmt.Errorf("Price or Rate can't be zero")
	}

	var profit, exposure float64

	switch payload.BetType {
	case "back":
		profit = (payload.OddsRate - 1) * float64(payload.Amount)
		exposure = float64(payload.Amount)
		break
	case "lay":
		profit = float64(payload.Amount)
		exposure = (payload.OddsRate - 1) * float64(payload.Amount)
		break
	case "no":
		profit = payload.Amount
		exposure = payload.OddsPrice * (payload.Amount / 100)
		break
	case "yes":
		profit = payload.OddsPrice * (payload.Amount / 100)
		exposure = payload.Amount
		break
	default:
		return fmt.Errorf("Invalid Bet Type")
	}

	if err := s.store.TransferBetValueToExposure(ctx, tx, payload.UserId, exposure); err != nil {
		return fmt.Errorf("Failed to transfer user balance :%w", err)
	}

	if err := s.store.PlaceBet(ctx, tx, payload, id, profit, exposure); err != nil {
		return fmt.Errorf("Failed to save bet :%w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (s *sportsService) BetHistoryPerGame(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, models.GroupedData, error) {

	var wg sync.WaitGroup
	var historyErr, runnerErr, fancybetsErr error

	var betHistory *[]models.BetHistoryPerGame
	var SavedRunner []models.SavedRunner
	var fancyBets []models.FancyBets

	wg.Add(1)
	go func() {
		defer wg.Done()
		betHistory, historyErr = s.store.BetHistoryPerGamePerUser(ctx, userId, eventId)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		SavedRunner, runnerErr = s.store.GetSavedRunners(ctx, eventId)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		fancyBets, fancybetsErr = s.store.FancyBetsPerEventIdSports(ctx, eventId, userId)
	}()

	wg.Wait()

	if historyErr != nil {
		return nil, models.GroupedData{}, historyErr
	}

	if runnerErr != nil {

		return nil, models.GroupedData{}, runnerErr
	}

	if fancybetsErr != nil {

		return nil, models.GroupedData{}, fancybetsErr
	}

	matchOddsResults := utils.CalculateActiveBetsOdds(betHistory, "Match Odds", SavedRunner)
	bookmakerResults := utils.CalculateActiveBetsOdds(betHistory, "Bookmaker", SavedRunner)
	fancyProjections := utils.CalculateActiveFancyBetsProjection(fancyBets)

	grouped := models.GroupedData{
		MatchOdds: matchOddsResults,
		Bookmaker: bookmakerResults,
		Fancy:     fancyProjections,
	}

	return betHistory, grouped, nil
}

func (s *sportsService) GetInPlayEvents(ctx context.Context) (*[]models.ActiveEvents, *[]models.ActiveEvents, *[]models.ActiveEvents, error) {
	type result struct {
		data    *[]models.ActiveEvents
		err     error
		sportID string
	}

	resultChan := make(chan result, 3)

	fetch := func(sportID string) {
		data, err := s.store.GetInPlayEvents(ctx, sportID)
		resultChan <- result{data: data, err: err, sportID: sportID}
	}

	go fetch("4")
	go fetch("2")
	go fetch("1")

	var cricket, tennis, football *[]models.ActiveEvents

	for i := 0; i < 3; i++ {
		res := <-resultChan
		if res.err != nil {
			return nil, nil, nil, res.err
		}
		switch res.sportID {
		case "4":
			cricket = res.data
		case "2":
			tennis = res.data
		case "1":
			football = res.data
		}
	}

	return cricket, tennis, football, nil
}

func (s *sportsService) GetAllEvents(ctx context.Context) (*[]models.ActiveEvents, *[]models.ActiveEvents, *[]models.ActiveEvents, error) {
	type result struct {
		data    *[]models.ActiveEvents
		err     error
		sportID string
	}

	resultChan := make(chan result, 3)

	fetch := func(sportID string) {
		data, err := s.store.GetAllEvents(ctx, sportID)
		resultChan <- result{data: data, err: err, sportID: sportID}
	}

	go fetch("4")
	go fetch("2")
	go fetch("1")

	var cricket, tennis, football *[]models.ActiveEvents

	for i := 0; i < 3; i++ {
		res := <-resultChan
		if res.err != nil {
			return nil, nil, nil, res.err
		}
		switch res.sportID {
		case "4":
			cricket = res.data
		case "2":
			tennis = res.data
		case "1":
			football = res.data
		}
	}

	return cricket, tennis, football, nil
}

func (s *sportsService) GetMatchSettings(ctx context.Context, sportsId, competitionId string) (*models.CombinedMatchSettings, error) {

	ts, err := s.store.GetSingleTournamentSettings(ctx, competitionId)

	if err == nil {
		return ts, nil
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	ss, err := s.store.GetSportsSettings(ctx, sportsId)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return ss, nil
}

func (s *sportsService) GetMatchOdds(ctx context.Context, eventId string) (*models.MarketInfo, error) {
	key := "sports:eventDetails:" + eventId

	odds, err := s.redis.Get(ctx, key).Result()
	if err == nil {
		var matchOdds models.Odds
		if err := json.Unmarshal([]byte(odds), &matchOdds); err != nil {
			return nil, err
		}

		return &matchOdds.MatchOdds, nil
	}

	url := "https://alp.playunlimited9.co.in/api/v2/competition/getEventDetail/" + eventId
	res, err := http.Get(url)
	if err != nil {
		log.Printf("Error creating request for event %s: %v", eventId, err)
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("Unexpected status code %d for event %s", res.StatusCode, eventId)
		return nil, errors.New("failed to fetch event details")
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Error reading response body for event %s: %v", eventId, err)
		return nil, err
	}

	var apiOdds models.Odds
	if err := json.Unmarshal(body, &apiOdds); err != nil {
		return nil, err
	}

	if err := s.redis.Set(ctx, key, body, time.Hour).Err(); err != nil {
		log.Printf("Error saving event details to Redis for %s: %v", eventId, err)
	}

	return &apiOdds.MatchOdds, nil
}

// func getPriceAndOdds(eventId, runnerId, marketName, betType string) (price, rate float64, err error) {
// 	url := "https://alp.playunlimited9.co.in/api/v2/competition/getEventDetail/" + eventId

// 	res, err := http.Get(url)
// 	if err != nil {
// 		log.Printf("Error making HTTP GET request: %v", err)
// 		return 0, 0, err
// 	}
// 	defer res.Body.Close()

// 	if res.StatusCode != http.StatusOK {
// 		log.Printf("Unexpected status code %d for event %s", res.StatusCode, eventId)
// 		return 0, 0, fmt.Errorf("unexpected status code: %d", res.StatusCode)
// 	}

// 	body, err := io.ReadAll(res.Body)
// 	if err != nil {
// 		log.Printf("Error reading response body for event %s: %v", eventId, err)
// 		return 0, 0, err
// 	}

// 	var data models.Odds
// 	if err := json.Unmarshal(body, &data); err != nil {
// 		log.Printf("Error unmarshalling JSON: %v", err)
// 		return 0, 0, err
// 	}

// 	switch marketName {
// 	case "Bookmaker":
// 		for _, runner := range data.BookMaker.Runners {
// 			if runner.RunnerId == runnerId {
// 				switch betType {
// 				case "back":
// 					price, rate = runner.Back.Price, runner.Back.Rate
// 					return price, rate, nil
// 				case "lay":
// 					price, rate = runner.Lay.Price, runner.Lay.Rate
// 					return price, rate, nil
// 				}
// 			}
// 		}

// 	case "Fancy":
// 		for _, runner := range data.Fancy.Runners {
// 			if runner.RunnerId == runnerId {
// 				switch betType {
// 				case "no":
// 					price, rate = runner.Lay.Price, runner.Lay.Rate
// 					return price, rate, nil
// 				case "yes":
// 					price, rate = runner.Back.Price, runner.Back.Rate
// 					return price, rate, nil
// 				}
// 			}
// 		}

// 	case "Match Odds":
// 		for _, runner := range data.MatchOdds.Runners {
// 			if runner.RunnerId == runnerId {
// 				switch betType {
// 				case "back":
// 					price, rate = runner.Back.Price, runner.Back.Rate
// 					return price, rate, nil
// 				case "lay":
// 					price, rate = runner.Lay.Price, runner.Lay.Rate
// 					return price, rate, nil
// 				}
// 			}
// 		}
// 	}

// 	return 0, 0, fmt.Errorf("runner %s not found in market %s", runnerId, marketName)
// }

// func (s *sportsService) GetList(id string) (interface{}, error) {
// 	ctx := context.Background()
// 	var jsonData interface{}

// 	key := "sports:getlist:" + id

// 	r, err := s.redis.Get(ctx, key).Result()

// 	if err == nil {
// 		if err := json.Unmarshal([]byte(r), &jsonData); err != nil {
// 			log.Println("Error unmarshaling cached data from Redis:", err)
// 			return nil, err
// 		}
// 		return jsonData, nil
// 	} else if err != redis.Nil {
// 		log.Printf("Error retrieving from Redis: %v", err)
// 	}

// 	res, err := http.Get("https://leisurebuzz.in/api/v2/competition/getList/" + id)

// 	if err != nil {
// 		log.Println("Error fetching data from external API:", err)
// 		return nil, err
// 	}
// 	defer func() {
// 		if cerr := res.Body.Close(); cerr != nil {
// 			log.Printf("Error closing response body: %v", cerr)
// 		}
// 	}()

// 	body, err := io.ReadAll(res.Body)
// 	if err != nil {
// 		log.Println("Error reading response body:", err)
// 		return nil, err
// 	}

// 	if err := json.Unmarshal(body, &jsonData); err != nil {
// 		log.Println("Error unmarshaling response body:", err)
// 		return nil, err
// 	}

// 	if err := s.redis.Set(ctx, key, body, 1*time.Hour).Err(); err != nil {
// 		log.Printf("Error storing data in Redis: %v", err)
// 	}

// 	return jsonData, nil
// }

// func (s *sportsService) ListEvents(sportsId, competitionId string) (interface{}, error) {

// 	ctx := context.Background()
// 	var jsonData interface{}

// 	key := "sports:listevents:" + sportsId + ":" + competitionId

// 	r, err := s.redis.Get(ctx, key).Result()

// 	if err == nil {
// 		if err := json.Unmarshal([]byte(r), &jsonData); err != nil {
// 			log.Println("Error unmarshaling cached data from Redis:", err)
// 			return nil, err
// 		}
// 		return jsonData, nil
// 	} else if err != redis.Nil {
// 		log.Printf("Error retrieving from Redis: %v", err)
// 	}

// 	res, err := http.Get("https://leisurebuzz.in/api/v2/competition/listEvents/" + sportsId + "/" + competitionId)

// 	if err != nil {
// 		log.Println("Error fetching data", err)
// 		return nil, err
// 	}
// 	defer func() {
// 		if cerr := res.Body.Close(); cerr != nil {
// 			log.Printf("Error closing response body: %v", cerr)
// 		}
// 	}()

// 	body, err := io.ReadAll(res.Body)

// 	if err != nil {
// 		log.Println("Error reading response body:", err)
// 		return nil, err
// 	}

// 	if err := json.Unmarshal(body, &jsonData); err != nil {
// 		log.Println("Error unmarshaling response body:", err)
// 		return nil, err
// 	}

// 	if err := s.redis.Set(ctx, key, body, 1*time.Hour).Err(); err != nil {
// 		log.Printf("Error storing data in Redis: %v", err)
// 	}

// 	return jsonData, nil

// }

// func (s *sportsService) GetEventDetail(eventId string) (interface{}, error) {

// 	var jsonData interface{}

// 	res, err := http.Get("https://leisurebuzz.in/api/v2/competition/getEventDetail/" + eventId)

// 	if err != nil {
// 		log.Println("Error fetching data", err)
// 		return nil, err
// 	}
// 	defer func() {
// 		if cerr := res.Body.Close(); cerr != nil {
// 			log.Printf("Error closing response body: %v", cerr)
// 		}
// 	}()

// 	body, err := io.ReadAll(res.Body)

// 	if err != nil {
// 		log.Println("Error reading response body:", err)
// 		return nil, err
// 	}

// 	if err := json.Unmarshal(body, &jsonData); err != nil {
// 		log.Println("Error unmarshaling response body:", err)
// 		return nil, err
// 	}

// 	return jsonData, nil
// }

// func (s *sportsService) GetMarketList(id string) (interface{}, error) {

// 	var jsonData interface{}

// 	res, err := http.Get("https://leisurebuzz.in/api/v2/competition/getMarketList/" + id)

// 	if err != nil {
// 		log.Println("Error fetching data", err)
// 		return nil, err
// 	}
// 	defer res.Body.Close()

// 	body, err := io.ReadAll(res.Body)

// 	if err != nil {
// 		log.Println("Error reading response body:", err)
// 		return nil, err
// 	}

// 	if err := json.Unmarshal(body, &jsonData); err != nil {
// 		log.Println("Error unmarshaling response body:", err)
// 		return nil, err
// 	}

// 	return jsonData, nil
// }
