package store

import (
	"context"
)

type AdminWalletStore interface {
	GetBalance(ctx context.Context, id string) (float64, error)
}

func (s *adminStore) GetBalance(ctx context.Context, id string) (float64, error) {

	var balance float64

	query := `SELECT balance FROM admins WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&balance)

	if err != nil {
		return 0, err
	}

	return balance, nil
}
