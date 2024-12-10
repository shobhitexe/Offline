package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"server/internal/models"
	"server/internal/store"
	"time"

	"github.com/redis/go-redis/v9"
)

type SportsService interface {
	// GetList(id string) (interface{}, error)
	// ListEvents(sportsId, competitionId string) (interface{}, error)
	// GetMarketList(id string) (interface{}, error)
	GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	GetEventDetail(ctx context.Context, eventId string) (map[string]interface{}, error)
	SaveActiveEvents(ctx context.Context, id string) error
	PlaceBet(ctx context.Context, payload models.PlaceBet) error
	BetHistoryPerGame(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, error)
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

	if err := s.redis.Set(ctx, key, serializedEvents, 24*time.Hour).Err(); err != nil {
		log.Printf("Error storing data in Redis: %v", err)
	}

	return events, nil
}

func (s *sportsService) SaveActiveEvents(ctx context.Context, id string) error {

	r, err := http.Get("https://alp.playunlimited9.co.in/api/v2/competition/getMarketList/" + id)

	if err != nil {
		return err
	}

	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading response body for event : %v", err)
		return err
	}

	var events []models.ActiveEvents

	if err := json.Unmarshal(body, &events); err != nil {
		return err
	}

	for _, event := range events {
		if err := s.store.SaveActiveEvents(ctx, event, id); err != nil {
			log.Printf("Failed to save event : %v", err)
			return err
		}
	}

	return nil
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

	var profit, exposure float64

	if payload.BetType == "back" || payload.BetType == "yes" {
		profit = (payload.OddsRate - 1) * float64(payload.Amount)
		exposure = float64(payload.Amount)
	} else {
		profit = float64(payload.Amount)
		exposure = (payload.OddsRate - 1) * float64(payload.Amount)
	}

	if err := s.store.TransferUserBalanceToExposure(ctx, tx, payload.UserId, exposure); err != nil {
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

func (s *sportsService) BetHistoryPerGame(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, error) {

	d, err := s.store.BetHistoryPerGame(ctx, userId, eventId)

	if err != nil {
		return nil, err
	}

	return d, nil
}

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
