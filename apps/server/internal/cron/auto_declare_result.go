package cron

import (
	"context"
	"encoding/json"
	"fmt"
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
		// log.Printf("Error processing events: %v", err)
		return err
	}

	log.Println("All results processed successfully.")
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
		bets, err := c.sportsStore.FindMarketOddsBetsByEventID(ctx, result.EventID, result.RunnerID, result.MarketID)
		if err != nil {
			return fmt.Errorf("error fetching bets for event %s and runner %s: %w", result.EventID, result.RunnerID, err)
		}

		if bets == nil || len(*bets) == 0 {
			// return fmt.Errorf("No active bets")
			continue
		}

		for _, bet := range *bets {

			tx, err := c.sportsStore.BeginTx(ctx)
			if err != nil {
				return fmt.Errorf("failed to begin transaction: %w", err)
			}

			defer func() {
				if p := recover(); p != nil {
					if rErr := tx.Rollback(ctx); rErr != nil {
						fmt.Printf("Rollback failed: %v\n", rErr)
					}
					panic(p)
				} else if err != nil {
					if rErr := tx.Rollback(ctx); rErr != nil {
						fmt.Printf("Rollback failed: %v\n", rErr)
					}
				}
			}()

			switch result.Status {

			case "WINNER":
				if bet.BetType == "back" {

					err := c.sportsStore.BetResultWin(ctx, tx, bet.Profit, bet.Exposure, bet.UserId)

					if err != nil {
						log.Println(err)
						return err
					}

					if err := c.sportsStore.ChangeActiveBetStatus(ctx, tx, bet.ID, "win"); err != nil {
						log.Println(err)
						return err
					}

				} else if bet.BetType == "lay" {
					err := c.sportsStore.BetResultLose(ctx, tx, bet.Exposure, bet.UserId)

					if err != nil {
						log.Println(err)
						return err
					}

					if err := c.sportsStore.ChangeActiveBetStatus(ctx, tx, bet.ID, "loss"); err != nil {
						log.Println(err)
						return err
					}
				}
				break
			case "LOSER":
				if bet.BetType == "back" {
					err := c.sportsStore.BetResultLose(ctx, tx, bet.Exposure, bet.UserId)

					if err != nil {
						log.Println(err)
						return err
					}

					if err := c.sportsStore.ChangeActiveBetStatus(ctx, tx, bet.ID, "loss"); err != nil {
						log.Println(err)
						return err
					}
				} else if bet.BetType == "lay" {
					err := c.sportsStore.BetResultWin(ctx, tx, bet.Profit, bet.Exposure, bet.UserId)

					if err != nil {
						log.Println(err)
						return err
					}

					if err := c.sportsStore.ChangeActiveBetStatus(ctx, tx, bet.ID, "win"); err != nil {
						log.Println(err)
						return err
					}
				}
				break
			default:
				// log.Printf("Unrecognized result status: %s for event %s", result.Status, result.EventID)
				return nil

			}

			delkey := "sport:activeEvents:" + matchType

			if err := c.redis.Del(ctx, delkey).Err(); err != nil {
				return fmt.Errorf("Failed to delete cache: %w", err)
			}

			if err := c.sportsStore.DeclareEvent(ctx, tx, result.EventID); err != nil {
				return fmt.Errorf("Failed to declare event as completed: %w", err)
			}

			if err := tx.Commit(ctx); err != nil {
				return fmt.Errorf("failed to commit transaction: %w", err)
			}

		}
	}
	return nil
}
