package cron

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/errgroup"
)

func (c *Cron) UpdateMatchOdds(ctx context.Context) error {

	now := time.Now().Unix()

	eventIds, err := c.redis.ZRangeByScore(ctx, "sports:active", &redis.ZRangeBy{
		Min: fmt.Sprintf("%d", now),
		Max: "+inf",
	}).Result()
	if err != nil {
		log.Printf("Error fetching active events from Redis: %v", err)
		return err
	}

	go func() {
		if len(eventIds) != 0 {
			if err := c.redis.ZRemRangeByScore(ctx, "sports:active", "-inf", fmt.Sprintf("%d", now)).Err(); err != nil {
				log.Printf("Failed to clean up expired keys in Redis: %v", err)
			}
		}
	}()

	g, gCtx := errgroup.WithContext(ctx)

	for _, key := range eventIds {
		key := key
		g.Go(func() error {
			return c.fetchAndCacheEventDetails(gCtx, key)
		})
	}

	if err := g.Wait(); err != nil {
		log.Printf("Error processing keys: %v", err)
		return err
	}

	return nil
}

func (c *Cron) fetchAndCacheEventDetails(ctx context.Context, eventId string) error {

	url := "https://alp.playunlimited9.co.in/api/v2/competition/getEventDetail/" + eventId

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		log.Printf("Error creating request for event %s: %v", eventId, err)
		return err
	}

	res, err := c.http.Do(req)

	if err != nil {
		log.Printf("Error fetching event details for %s: %v", eventId, err)
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("Unexpected status code %d for event %s", res.StatusCode, eventId)
		return errors.New("failed to fetch event details")
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Error reading response body for event %s: %v", eventId, err)
		return err
	}

	go func() {
		setKey := "sports:eventDetails:" + eventId
		err = c.redis.Set(ctx, setKey, string(body), 24*time.Hour).Err()
		if err != nil {
			log.Printf("Error caching event details for %s: %v", eventId, err)
			// return err
		}
	}()

	channel := "sports:events"
	message := map[string]string{
		"eventId": eventId,
		"details": string(body),
	}

	msg, err := json.Marshal(message)
	if err != nil {
		log.Printf("Error marshaling event details for %s: %v", eventId, err)
		return err
	}

	err = c.redis.Publish(ctx, channel, msg).Err()
	if err != nil {
		log.Printf("Error publishing event details for %s: %v", eventId, err)
		return err
	}

	// log.Printf("Successfully published and cached details for event %s", eventId)
	return nil

}

// func (c *Cron) processEventsForKey(ctx context.Context, key string) error {
// 	var events []models.ActiveEvents

// 	ev, err := c.redis.Get(ctx, key).Result()
// 	if err != nil {

// 		if err == redis.Nil {
// 			log.Printf("Key not found in Redis, fetching from DB for key: %s", key)
// 			events, err := c.sportsStore.GetActiveEvents(ctx, key)
// 			if err != nil {
// 				log.Printf("Error retrieving data from DB for key %s: %v", key, err)
// 				return err
// 			}

// 			if len(*events) == 0 {
// 				log.Printf("No active events found in DB for key: %s", key)
// 				if setErr := c.redis.Set(ctx, key, false, time.Hour).Err(); setErr != nil {
// 					log.Printf("Error caching DB data in Redis for key %s: %v", key, setErr)
// 				}
// 				return nil
// 			}

// 			cachedData, err := json.Marshal(events)
// 			if err != nil {
// 				log.Printf("Error marshaling events for Redis cache for key %s: %v", key, err)
// 				return err
// 			}

// 			if setErr := c.redis.Set(ctx, key, cachedData, time.Hour).Err(); setErr != nil {
// 				log.Printf("Error caching DB data in Redis for key %s: %v", key, setErr)
// 			}

// 			return nil
// 		}

// 		log.Printf("Error retrieving data from Redis for key %s: %v", key, err)
// 		return err
// 	}

// 	if err := json.Unmarshal([]byte(ev), &events); err != nil {
// 		log.Printf("Error unmarshaling events from Redis for key %s: %v", key, err)
// 		return err
// 	}

// 	if len(events) == 0 {
// 		log.Printf("No events to process for key: %s", key)
// 		return nil
// 	}

// 	g, gCtx := errgroup.WithContext(ctx)
// 	semaphore := make(chan struct{}, 10)

// 	for _, event := range events {
// 		event := event

// 		eventKey := "sports:active:" + event.EventId

// 		active, err := c.redis.Get(ctx, eventKey).Bool()

// 		if err != nil && err != redis.Nil {
// 			return err
// 		}

// 		if active == true {

// 			semaphore <- struct{}{}
// 			g.Go(func() error {
// 				defer func() { <-semaphore }()
// 				if err := c.fetchAndCacheEventDetails(gCtx, event); err != nil {
// 					log.Printf("Failed to process event %s: %v", event.EventId, err)
// 					return nil
// 				}
// 				return nil
// 			})
// 		}

// 	}

// 	if err := g.Wait(); err != nil {
// 		log.Printf("Error processing events: %v", err)
// 		return err
// 	}

//		return nil
//	}
