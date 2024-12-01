package store

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type BaseStore struct {
	db *pgxpool.Pool
}

func NewBaseStore(db *pgxpool.Pool) *BaseStore {
	return &BaseStore{db: db}
}

func (b *BaseStore) BeginTx(ctx context.Context) (pgx.Tx, error) {
	tx, err := b.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	return tx, nil
}
