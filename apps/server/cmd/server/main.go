package main

import (
	"log"
	"server/pkg/db"
)

func main() {

	env := NewEnvConfig()

	dbConfig := DBConfig{
		addr:         env.GetString("DB_ADDR", ""),
		maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
		maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 5),
		maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "10m"),
	}

	conn := db.NewConnection()

	db, err := conn.ConnectToPostgres(dbConfig.addr, dbConfig.maxOpenConns, dbConfig.maxIdleConns, dbConfig.maxIdleTime)

	if err != nil {
		log.Fatalf("Failed to create database pool: %v", err)
	}
	defer db.Close()

	redisConfig := RedisConfig{
		Addr:     env.GetString("REDIS_ADDR", "localhost:6379"),
		Username: env.GetString("REDIS_USERNAME", "default"),
		Password: env.GetString("REDIS_PASSWORD", ""),
		DB:       0,
	}

	rdb, err := conn.ConnectToRedis(redisConfig.Addr, redisConfig.Username, redisConfig.Password, redisConfig.DB)
	if err != nil {
		log.Fatalf("Failed to connect to redis: %v", err)
	}
	defer rdb.Close()

	cfg := Config{
		Addr:        env.GetString("PORT", ":8080"),
		dbConfig:    dbConfig,
		redisConfig: redisConfig,
	}

	srv := APIServer{
		config: cfg,
		db:     db,
		redis:  rdb,
	}

	mux := srv.mount()

	log.Fatal(srv.run(mux))

}
