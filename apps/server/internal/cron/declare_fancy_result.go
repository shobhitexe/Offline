package cron

import (
	"context"
	"log"
)

func (c *Cron) DeclareFancyResult(ctx context.Context) error {

	activebets, err := c.sportsStore.GetActiveFancyBets(ctx)

	if err != nil {
		return err
	}

	log.Panicln(activebets)

	return nil
}
