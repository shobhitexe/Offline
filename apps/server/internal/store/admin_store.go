package store

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error
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
