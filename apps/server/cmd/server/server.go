package main

import (
	"log"
	"net/http"
	"server/internal/routes"
	"server/internal/websocket"
	"server/pkg/di"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type APIServer struct {
	config Config
	db     *pgxpool.Pool
	redis  *redis.Client
}

type Config struct {
	Addr        string
	dbConfig    DBConfig
	redisConfig RedisConfig
}

type DBConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

type RedisConfig struct {
	Addr     string
	Username string
	Password string
	DB       int
}

func (s *APIServer) mount() http.Handler {

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	container := di.NewContainer(s.db, s.redis)

	r.Route("/api/v1", func(r chi.Router) {
		routes.RegisterHealthRoutes(r, container.HealthHandler)
		routes.RegisterAdminRoutes(r, container.AdminHandler)
		routes.RegisterSportsRoutes(r, container.SportsHandler)
		routes.RegisterUserRoutes(r, container.UserHandler)
	})

	manager := websocket.NewManager(s.db, s.redis)
	r.HandleFunc("/ws", manager.ServerWs)

	return r

}

func (s *APIServer) run(mux http.Handler) error {
	srv := http.Server{
		Addr:         s.config.Addr,
		Handler:      mux,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("API server started at port: %s", srv.Addr)

	return srv.ListenAndServe()
}
