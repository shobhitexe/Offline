package service

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"server/internal/store"
	"time"

	"github.com/redis/go-redis/v9"
)

type SportsService interface {
	GetList(id string) (interface{}, error)
	ListEvents(sportsId, competitionId string) (interface{}, error)
	GetEventDetail(eventId string) (interface{}, error)
	GetMarketList(id string) (interface{}, error)
}

type sportsService struct {
	store  *store.SportsStore
	client *http.Client
	redis  *redis.Client
}

func NewSportsService(store store.SportsStore, client *http.Client, redis *redis.Client) SportsService {
	return &sportsService{
		store:  &store,
		client: client,
		redis:  redis,
	}
}

func (s *sportsService) GetList(id string) (interface{}, error) {
	ctx := context.Background()
	var jsonData interface{}

	key := "sports:getlist:" + id

	r, err := s.redis.Get(ctx, key).Result()

	if err == nil {
		if err := json.Unmarshal([]byte(r), &jsonData); err != nil {
			log.Println("Error unmarshaling cached data from Redis:", err)
			return nil, err
		}
		return jsonData, nil
	} else if err != redis.Nil {
		log.Printf("Error retrieving from Redis: %v", err)
	}

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/getList/" + id)

	if err != nil {
		log.Println("Error fetching data from external API:", err)
		return nil, err
	}
	defer func() {
		if cerr := res.Body.Close(); cerr != nil {
			log.Printf("Error closing response body: %v", cerr)
		}
	}()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	if err := json.Unmarshal(body, &jsonData); err != nil {
		log.Println("Error unmarshaling response body:", err)
		return nil, err
	}

	if err := s.redis.Set(ctx, key, body, 1*time.Hour).Err(); err != nil {
		log.Printf("Error storing data in Redis: %v", err)
	}

	return jsonData, nil
}

func (s *sportsService) ListEvents(sportsId, competitionId string) (interface{}, error) {

	ctx := context.Background()
	var jsonData interface{}

	key := "sports:listevents:" + sportsId + competitionId

	r, err := s.redis.Get(ctx, key).Result()

	if err == nil {
		if err := json.Unmarshal([]byte(r), &jsonData); err != nil {
			log.Println("Error unmarshaling cached data from Redis:", err)
			return nil, err
		}
		return jsonData, nil
	} else if err != redis.Nil {
		log.Printf("Error retrieving from Redis: %v", err)
	}

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/listEvents/" + sportsId + "/" + competitionId)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer func() {
		if cerr := res.Body.Close(); cerr != nil {
			log.Printf("Error closing response body: %v", cerr)
		}
	}()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	if err := json.Unmarshal(body, &jsonData); err != nil {
		log.Println("Error unmarshaling response body:", err)
		return nil, err
	}

	if err := s.redis.Set(ctx, key, body, 1*time.Hour).Err(); err != nil {
		log.Printf("Error storing data in Redis: %v", err)
	}

	return jsonData, nil

}

func (s *sportsService) GetEventDetail(eventId string) (interface{}, error) {

	var jsonData interface{}

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/getEventDetail/" + eventId)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer func() {
		if cerr := res.Body.Close(); cerr != nil {
			log.Printf("Error closing response body: %v", cerr)
		}
	}()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	if err := json.Unmarshal(body, &jsonData); err != nil {
		log.Println("Error unmarshaling response body:", err)
		return nil, err
	}

	return jsonData, nil
}

func (s *sportsService) GetMarketList(id string) (interface{}, error) {

	var jsonData interface{}

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/getMarketList/" + id)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	if err := json.Unmarshal(body, &jsonData); err != nil {
		log.Println("Error unmarshaling response body:", err)
		return nil, err
	}

	return jsonData, nil
}
