package main

import (
	"log"
	"net/http"
	"net/url"
	"server/internal/routes"
	"server/pkg/di"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

type APIServer struct {
	config Config
	db     *pgxpool.Pool
}

type Config struct {
	Addr      string
	dbConfig  DBConfig
	ProxyAddr string
}

type DBConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

func NewHTTPClientWithProxy(proxyAddr string) (*http.Client, error) {
	proxyURL, err := url.Parse(proxyAddr)
	if err != nil {
		return nil, err
	}

	transport := &http.Transport{
		Proxy: http.ProxyURL(proxyURL),
	}

	client := &http.Client{
		Transport: transport,
		Timeout:   30 * time.Second,
	}

	return client, nil
}

func (s *APIServer) mount() http.Handler {

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	httpClient, err := NewHTTPClientWithProxy(s.config.ProxyAddr)
	if err != nil {
		log.Fatalf("Failed to create HTTP client with proxy: %v", err)
	}

	container := di.NewContainer(s.db, httpClient)

	r.Route("/api/v1", func(r chi.Router) {
		routes.RegisterHealthRoutes(r, container.HealthHandler)
		routes.RegisterAdminRoutes(r, container.AdminHandler)
	})

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
