package cron

import (
	"context"
	"log"
	"net"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Cron struct {
	db    *pgxpool.Pool
	redis *redis.Client
	http  *http.Client
}

func NewScheduler(db *pgxpool.Pool, redis *redis.Client) *Cron {

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

	return &Cron{db: db, redis: redis, http: httpClient}
}

func (c *Cron) StartCron() {
	go func() {
		ticker := time.NewTicker(60 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				ctx, cancel := context.WithTimeout(context.Background(), 50*time.Second)
				defer cancel()

				if err := c.UpdateMatchOdds(ctx); err != nil {
					log.Printf("Error updating match odds: %v", err)
				}
			}
		}
	}()
}
