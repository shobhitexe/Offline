package cron

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"server/internal/models"
	"sync"

	"golang.org/x/sync/errgroup"
)

func (c *Cron) AutoAddMatches(ctx context.Context) error {

	a, err := c.sportsStore.GetAutoUpdatingTournaments(ctx)

	g, gCtx := errgroup.WithContext(ctx)

	if err != nil {
		return err
	}

	for _, item := range a {

		item := item

		g.Go(func() error {
			select {
			case <-gCtx.Done():
				log.Printf("Context canceled for ID %s: %v", item.ID, gCtx.Err())
				return gCtx.Err()
			default:
				return c.SaveActiveEvents(gCtx, item.SportsId, item.ID)
			}
		})

	}

	if err := g.Wait(); err != nil {
		// log.Printf("Error processing events: %v", err)
		return err
	}

	return nil
}

func (c *Cron) SaveActiveEvents(ctx context.Context, sportsId, competitionId string) error {

	r, err := http.Get("https://leisurebuzz.in/api/v2/competition/listEvents/" + sportsId + "/" + competitionId)
	if err != nil {
		return fmt.Errorf("failed to fetch events: %w", err)
	}
	defer r.Body.Close()

	if r.StatusCode != http.StatusOK {
		return fmt.Errorf("error: invalid status code %d returned", r.StatusCode)
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading response body for competition %s: %v", competitionId, err)
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
			if err := c.sportsStore.SaveActiveEvents(ctx, event, saveRunner, sportsId); err != nil {
				log.Printf("Failed to save active event %s: %v", event.Event.ID, err)
				errors = append(errors, err)
			}
		}(event)
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		key := "sports:activeEvents:" + sportsId
		if err := c.redis.Del(ctx, key).Err(); err != nil {
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
