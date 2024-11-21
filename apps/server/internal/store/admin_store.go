package store

import (
	"context"
	"server/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminStore interface {
	GetAdminByUsername(ctx context.Context, username string) (*models.Admin, error)
}

type adminStore struct {
	db *pgxpool.Pool
}

func NewAdminStore(db *pgxpool.Pool) AdminStore {
	return &adminStore{db: db}
}

func (s *adminStore) GetAdminByUsername(ctx context.Context, username string) (*models.Admin, error) {
	var admin models.Admin
	query := `SELECT id, name, username, password FROM admins WHERE username = $1`
	err := s.db.QueryRow(ctx, query, username).Scan(&admin.ID, &admin.Name, &admin.Username, &admin.Password)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}
