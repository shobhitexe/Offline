package websocket

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type WebsocketStore struct {
	db    *pgxpool.Pool
	redis *redis.Client
}

func NewWebsocketStore(db *pgxpool.Pool, redis *redis.Client) *WebsocketStore {
	return &WebsocketStore{db: db, redis: redis}
}

func (s *WebsocketStore) UserBalance(ctx context.Context, id string) (*models.UserWallet, error) {

	var wallet models.UserWallet

	query := `SELECT balance, exposure FROM users WHERE id = $1`
	if err := s.db.QueryRow(ctx, query, id).Scan(&wallet.Balance, &wallet.Exposure); err != nil {
		return nil, fmt.Errorf("failed to fetch balance: %v", err)
	}

	return &wallet, nil
}

func (s *WebsocketStore) GetEventDetails(ctx context.Context, eventId string) (map[string]interface{}, error) {

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
