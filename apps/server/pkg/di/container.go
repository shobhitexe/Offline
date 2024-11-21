package di

import (
	"server/internal/handlers"
	"server/internal/service"
	"server/internal/store"
	"server/pkg/utils"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Container struct {
	HealthHandler *handlers.HealthHandler
	AdminHandler  *handlers.AdminHandler
}

func NewContainer(db *pgxpool.Pool) *Container {

	utils := utils.NewUtils()

	adminStore := store.NewAdminStore(db)
	adminService := service.NewAdminService(adminStore)

	return &Container{
		HealthHandler: handlers.NewHealthHandler(utils),
		AdminHandler:  handlers.NewAdminHandler(adminService, utils),
	}

}
