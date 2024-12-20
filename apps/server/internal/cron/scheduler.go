package cron

import (
	"context"
	"log"
	"net"
	"net/http"
	"server/internal/store"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cron struct {
	sportsStore store.AdminSportsStore
	redis       *redis.Client
	http        *http.Client
}

func NewScheduler(sportsStore store.AdminSportsStore, redis *redis.Client) *Cron {

	httpClient := &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        10,
			IdleConnTimeout:     30 * time.Second,
			TLSHandshakeTimeout: 10 * time.Second,
			DialContext: (&net.Dialer{
				Timeout: 5 * time.Second,
			}).DialContext,
		},
	}

	return &Cron{sportsStore: sportsStore, redis: redis, http: httpClient}
}

func (c *Cron) StartCron(ctx context.Context) {
	// go func() {
	// 	ticker := time.NewTicker(600 * time.Second)
	// 	defer ticker.Stop()

	// 	for {
	// 		select {
	// 		case <-ticker.C:

	// 			taskCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	// 			defer cancel()

	// 			if err := c.AutoDeclareResult(taskCtx); err != nil {
	// 				log.Printf("Error in auto declaring results: %v", err)
	// 			}
	// 			if err := c.GetMatchOddsResult(taskCtx); err != nil {
	// 				log.Printf("Error in auto declaring results: %v", err)
	// 			}
	// 		case <-ctx.Done():
	// 			log.Println("Stopping 600-second cron tasks...")
	// 			return

	// 		}
	// 	}
	// }()

	go func() {
		ticker := time.NewTicker(500 * time.Millisecond)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				taskCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
				defer cancel()

				if err := c.UpdateMatchOdds(taskCtx); err != nil {
					log.Printf("Error updating match odds: %v", err)
				}

			case <-ctx.Done():
				log.Println("Stopping 1-second cron tasks...")
				return
			}
		}
	}()

}
