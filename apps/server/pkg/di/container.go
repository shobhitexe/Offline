package di

import (
	"server/internal/handlers"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Container struct {
	HealthHandler *handlers.HealthHandler
}

func NewContainer(db *pgxpool.Pool) *Container {

	return &Container{
		HealthHandler: handlers.NewHealthHandler(),
	}

}
