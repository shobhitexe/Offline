package cron

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"server/internal/models"
	"time"

	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/errgroup"
)

func (c *Cron) UpdateMatchOdds(ctx context.Context) error {
	keys := []string{
		"sports:activeEvents:1",
		"sports:activeEvents:2",
		"sports:activeEvents:4",
	}

	g, gCtx := errgroup.WithContext(ctx)

	for _, key := range keys {
		key := key
		g.Go(func() error {
			return c.processEventsForKey(gCtx, key)
		})
	}

	if err := g.Wait(); err != nil {
		log.Printf("Error processing keys: %v", err)
		return err
	}

	return nil
}

func (c *Cron) processEventsForKey(ctx context.Context, key string) error {
	var events []models.ActiveEvents

	ev, err := c.redis.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			log.Printf("No active events found in Redis for key: %s", key)
			return nil
		}
		log.Printf("Error retrieving data from Redis for key %s: %v", key, err)
		return err
	}

	if err := json.Unmarshal([]byte(ev), &events); err != nil {
		log.Printf("Error unmarshaling events from Redis for key %s: %v", key, err)
		return err
	}

	if len(events) == 0 {
		log.Printf("No events to process for key: %s", key)
		return nil
	}

	g, gCtx := errgroup.WithContext(ctx)
	semaphore := make(chan struct{}, 10)

	for _, event := range events {
		event := event
		semaphore <- struct{}{}
		g.Go(func() error {
			defer func() { <-semaphore }()
			if err := c.fetchAndCacheEventDetails(gCtx, event); err != nil {
				log.Printf("Failed to process event %s: %v", event.EventId, err)
				return nil
			}
			return nil
		})
	}

	if err := g.Wait(); err != nil {
		log.Printf("Error processing events: %v", err)
		return err
	}

	return nil
}
func (c *Cron) fetchAndCacheEventDetails(ctx context.Context, event models.ActiveEvents) error {

	url := "https://alp.playunlimited9.co.in/api/v2/competition/getEventDetail/" + event.EventId

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		log.Printf("Error creating request for event %s: %v", event.EventId, err)
		return err
	}

	res, err := c.http.Do(req)

	if err != nil {
		log.Printf("Error fetching event details for %s: %v", event.EventId, err)
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("Unexpected status code %d for event %s", res.StatusCode, event.EventId)
		return errors.New("failed to fetch event details")
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Error reading response body for event %s: %v", event.EventId, err)
		return err
	}

	setKey := "sports:eventDetails:" + event.EventId
	err = c.redis.Set(ctx, setKey, string(body), 24*time.Hour).Err()
	if err != nil {
		log.Printf("Error caching event details for %s: %v", event.EventId, err)
		return err
	}

	// log.Printf("Successfully cached details for event %s", event.EventId)

	return nil
}
