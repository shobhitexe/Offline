package main

import (
	"log"
	"server/pkg/db"

	"github.com/redis/go-redis/v9"
)

func main() {

	env := NewEnvConfig()

	dbConfig := DBConfig{
		addr:         env.GetString("DB_ADDR", ""),
		maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
		maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 5),
		maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "10m"),
	}

	db, err := db.ConnectToPostgres(dbConfig.addr, dbConfig.maxOpenConns, dbConfig.maxIdleConns, dbConfig.maxIdleTime)

	if err != nil {
		log.Fatalf("Failed to create database pool")
	}
	defer db.Close()

	rdb := redis.NewClient(&redis.Options{
		Addr:     env.GetString("REDIS_ADDR", "localhost:6379"),
		Username: env.GetString("REDIS_USERNAME", "default"),
		Password: env.GetString("REDIS_PASSWORD", ""),
		DB:       0,
	})

	cfg := Config{
		Addr:      env.GetString("PORT", ":8080"),
		dbConfig:  dbConfig,
		ProxyAddr: env.GetString("PROXY_ADDR", "0.0.0.0"),
	}

	srv := APIServer{
		config: cfg,
		db:     db,
		redis:  rdb,
	}

	mux := srv.mount()

	log.Fatal(srv.run(mux))

}
