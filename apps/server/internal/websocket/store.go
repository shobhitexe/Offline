package websocket

import (
	"context"
	"fmt"
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

func (s *WebsocketStore) UserBalance(ctx context.Context, ids []string) ([]models.UserWallet, error) {

	var wallets []models.UserWallet

	query := `SELECT id, balance, exposure FROM users WHERE id = ANY($1)`
	rows, err := s.db.Query(ctx, query, ids)

	if err != nil {
		return nil, fmt.Errorf("failed to fetch balance: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var wallet models.UserWallet

		if err := rows.Scan(&wallet.ID, &wallet.Balance, &wallet.Exposure); err != nil {
			return nil, err
		}

		wallets = append(wallets, wallet)

	}

	return wallets, nil
}

// func (s *WebsocketStore) GetEventDetails(ctx context.Context, eventId string) (map[string]interface{}, error) {

// 	go func(eventId string) {
// 		expiry := time.Now().Add(5 * time.Minute).Unix()
// 		z := redis.Z{
// 			Score:  float64(expiry),
// 			Member: eventId,
// 		}
// 		if err := s.redis.ZAdd(ctx, "sports:active", z).Err(); err != nil {
// 			log.Printf("Failed to update active event in Redis: %s", err)
// 		}
// 	}(eventId)

// 	key := "sports:eventDetails:" + eventId

// 	ev, err := s.redis.Get(ctx, key).Result()
// 	if err == redis.Nil {
// 		log.Printf("Key not found in Redis: %s", key)
// 		return nil, nil
// 	}
// 	if err != nil {
// 		log.Printf("Error fetching key from Redis: %s, error: %v", key, err)
// 		return nil, err
// 	}

// 	var jsonData map[string]interface{}
// 	if err := json.Unmarshal([]byte(ev), &jsonData); err != nil {
// 		log.Printf("Error unmarshaling JSON for key: %s, error: %v", key, err)
// 		return nil, err
// 	}

// 	return jsonData, nil

// }
