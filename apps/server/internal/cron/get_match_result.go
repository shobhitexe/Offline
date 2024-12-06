package cron

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"server/internal/models"
	"sync"
	"time"
)

func (c *Cron) GetMatchOddsResult(ctx context.Context) error {
	keys := []string{"1", "2", "4"}
	var wg sync.WaitGroup

	for _, key := range keys {
		wg.Add(1)
		go func(key string) {
			defer wg.Done()

			url := "https://leisurebuzz.in/api/v2/competition/getMarketList/" + key
			redisKey := "sports:results:" + key

			req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
			if err != nil {
				log.Printf("Error creating request for event %s: %v", key, err)
				return
			}

			res, err := c.http.Do(req)
			if err != nil {
				log.Printf("Error fetching event details for %s: %v", key, err)
				return
			}
			defer res.Body.Close()

			if res.StatusCode != http.StatusOK {
				log.Printf("Unexpected status code %d for event %s", res.StatusCode, key)
				return
			}

			body, err := io.ReadAll(res.Body)
			if err != nil {
				log.Printf("Error reading response body for event %s: %v", key, err)
				return
			}

			var results []models.MatchOddsResult

			if err := json.Unmarshal(body, &results); err != nil {
				log.Printf("Error unmarshaling response body: %v", err)
				return
			}

			runnerList := []models.RunnerResult{}
			for _, result := range results {
				for _, runner := range result.MatchOdds.Runners {
					if runner.Status == "ACTIVE" {
						runnerList = append(runnerList, models.RunnerResult{
							RunnerName: runner.RunnerName,
							RunnerID:   runner.RunnerID,
							MarketID:   result.MatchOdds.MarketID,
							MarketName: result.MatchOdds.MarketName,
							EventID:    result.EventID,
							EventName:  result.EventName,
							Status:     runner.Status,
						})
					}

				}
			}

			r, err := json.Marshal(&runnerList)

			if err != nil {
				log.Printf("Error marshaling response body: %v", err)
				return
			}

			if err := c.redis.Set(ctx, redisKey, r, 1*time.Hour).Err(); err != nil {
				log.Printf("Error saving result to redis %s: %v", key, err)
				return
			}

			log.Printf("Successfully processed event %s and saved to Redis", key)
		}(key)
	}

	wg.Wait()
	return nil
}
