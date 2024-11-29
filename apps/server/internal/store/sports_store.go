package store

import "github.com/jackc/pgx/v5/pgxpool"

type SportsStore interface{}

type sportsStore struct {
	db *pgxpool.Pool
}

func NewSportsStore(db *pgxpool.Pool) SportsStore {
	return &sportsStore{db: db}
}
