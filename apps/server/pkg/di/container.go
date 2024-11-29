package di

import (
	"net/http"
	"server/internal/handlers"
	"server/internal/service"
	"server/internal/store"
	"server/pkg/utils"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Container struct {
	HealthHandler *handlers.HealthHandler
	AdminHandler  *handlers.AdminHandler
	SportsHandler *handlers.SportsHandler
}

func NewContainer(db *pgxpool.Pool, httpClient *http.Client) *Container {

	utils := utils.NewUtils()

	//admin
	adminStore := store.NewAdminStore(db)
	adminService := service.NewAdminService(adminStore)

	//sports
	sportsStore := store.NewSportsStore(db)
	sportsService := service.NewSportsService(sportsStore, httpClient)

	return &Container{
		HealthHandler: handlers.NewHealthHandler(utils),
		AdminHandler:  handlers.NewAdminHandler(adminService, utils),
		SportsHandler: handlers.NewSportsHandler(sportsService, utils),
	}

}
