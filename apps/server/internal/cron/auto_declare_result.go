package cron

import (
	"context"
	"encoding/json"
	"log"
	"server/internal/models"

	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/errgroup"
)

func (c *Cron) AutoDeclareResult(ctx context.Context) error {
	eventIDs := []string{"1", "2", "4"}

	g, gCtx := errgroup.WithContext(ctx)

	for _, eventID := range eventIDs {
		eventID := eventID
		g.Go(func() error {
			select {
			case <-gCtx.Done():
				log.Printf("Context canceled for event ID %s: %v", eventID, gCtx.Err())
				return gCtx.Err()
			default:
				return c.processActiveEvents(gCtx, eventID)
			}
		})
	}

	if err := g.Wait(); err != nil {
		log.Printf("Error processing events: %v", err)
		return err
	}

	log.Println("All events processed successfully.")
	return nil
}

func (c *Cron) processActiveEvents(ctx context.Context, matchType string) error {

	redisKey := "sports:results:" + matchType

	result, err := c.redis.Get(ctx, redisKey).Result()

	if err != nil && err != redis.Nil {
		return err
	}

	if err == redis.Nil {
		log.Printf("No result found in Redis for key %s", redisKey)
		return nil
	}

	resultMap := []models.RunnerResult{}

	if err := json.Unmarshal([]byte(result), &resultMap); err != nil {
		return err
	}

	for _, result := range resultMap {

		bets, err := c.sportsStore.FindActiveBetsByEventID(ctx, result.EventID, result.RunnerID)

		if err != nil {
			return err
		}

		if bets == nil || len(*bets) == 0 {
			continue
		}

		// log.Println(bets)

		// if result.Status == "WINNER" {
		// 	bets, err := c.sportsStore.FindActiveBetsByEventID(ctx, result.EventID, result.RunnerID)

		// 	if err != nil {
		// 		return err
		// 	}

		// }

	}

	return nil
}
