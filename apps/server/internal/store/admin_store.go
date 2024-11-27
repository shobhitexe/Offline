package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminStore interface {
	GetAdminByUsername(ctx context.Context, username string) (*models.Admin, error)
	RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error
	AdminAgentStore
	AdminWalletStore
}

type adminStore struct {
	db *pgxpool.Pool
}

func NewAdminStore(db *pgxpool.Pool) AdminStore {
	return &adminStore{db: db}
}

func (s *adminStore) GetAdminByUsername(ctx context.Context, username string) (*models.Admin, error) {
	var admin models.Admin
	query := `SELECT id, name, username, password, sports_share FROM admins WHERE username = $1`
	err := s.db.QueryRow(ctx, query, username).Scan(&admin.ID, &admin.Name, &admin.Username, &admin.Password, &admin.SportsShare)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *adminStore) RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error {

	query := `INSERT INTO login_histories (user_id, user_type, login_ip, user_agent)
	VALUES ($1, $2, $3, $4)`

	_, err := s.db.Exec(ctx, query, userId, userType, loginIp, userAgent)
	if err != nil {
		return fmt.Errorf("failed to record login history: %w", err)
	}

	return nil

}
