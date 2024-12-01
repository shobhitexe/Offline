package db

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Connection struct{}

func NewConnection() *Connection {
	return &Connection{}
}

func (c *Connection) ConnectToPostgres(dsn string, maxOpenConns, maxIdleConns int, maxIdleTime string) (*pgxpool.Pool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("Failed to open database pool :%s", err)

		return nil, err
	}
	pool.Config().MaxConns = int32(maxOpenConns)
	pool.Config().MinConns = int32(maxIdleConns)
	d, err := time.ParseDuration(maxIdleTime)
	if err != nil {
		log.Fatalf("Failed to parse maxIdleTime string :%s", err)
		return nil, err
	}
	pool.Config().MaxConnIdleTime = d

	err = pool.Ping(ctx)
	if err != nil {
		log.Fatalf("Failed to ping database closing connection :%s", err)
		pool.Close()
		return nil, err
	}

	log.Println("Succesfully created database pool")

	return pool, nil
}

func (c *Connection) ConnectToRedis(Addr, Username, Password string, DB int) (*redis.Client, error) {

	rdb := redis.NewClient(&redis.Options{
		Addr:     Addr,
		Username: Username,
		Password: Password,
		DB:       DB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
		return nil, err
	}

	log.Println("Succesfully connected to redis")

	return rdb, nil

}
