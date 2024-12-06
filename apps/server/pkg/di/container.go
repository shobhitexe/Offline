package di

import (
	"server/internal/cron"
	"server/internal/handlers"
	"server/internal/service"
	"server/internal/store"
	"server/pkg/utils"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Container struct {
	HealthHandler *handlers.HealthHandler
	AdminHandler  *handlers.AdminHandler
	SportsHandler *handlers.SportsHandler
	UserHandler   *handlers.UserHandler
}

func NewContainer(db *pgxpool.Pool, redis *redis.Client) *Container {

	utils := utils.NewUtils()
	validator := validator.New()

	//admin
	adminStore := store.NewAdminStore(db)
	adminService := service.NewAdminService(adminStore)

	//sports
	sportsStore := store.NewSportsStore(db)
	sportsService := service.NewSportsService(sportsStore, redis)

	//user
	userStore := store.NewUserStore(db)
	userService := service.NewUserService(userStore)

	// cron jobs
	c := cron.NewScheduler(sportsStore, redis)
	c.StartCron()

	return &Container{
		HealthHandler: handlers.NewHealthHandler(utils),
		AdminHandler:  handlers.NewAdminHandler(adminService, utils, validator),
		SportsHandler: handlers.NewSportsHandler(sportsService, utils, validator),
		UserHandler:   handlers.NewUserHandler(utils, userService, validator),
	}

}
