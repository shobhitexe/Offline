package store

import (
	"context"
	"fmt"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error
	AdminDetails(ctx context.Context, id string) (*models.Admin, error)
	AdminAgentStore
	AdminWalletStore
	AdminUserStore
}

type adminStore struct {
	*BaseStore
}

func NewAdminStore(db *pgxpool.Pool) AdminStore {
	return &adminStore{BaseStore: NewBaseStore(db)}
}

func (s *adminStore) RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error {

	query := `INSERT INTO login_histories (admin_id, user_type, login_ip, user_agent)
	VALUES ($1, $2, $3, $4)`

	_, err := s.db.Exec(ctx, query, userId, userType, loginIp, userAgent)
	if err != nil {
		return fmt.Errorf("failed to record login history: %w", err)
	}

	return nil

}

func (s *adminStore) AdminDetails(ctx context.Context, id string) (*models.Admin, error) {
	var admin models.Admin

	query := `SELECT id, username, name, balance, 
	TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at
	FROM admins WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&admin.ID, &admin.Username, &admin.Name, &admin.Balance, &admin.CreatedAt)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &admin, nil
}
