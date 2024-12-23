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
	IsAdminBlocked(ctx context.Context, id string) (bool, error)
	ChangeAdminBlockStatus(ctx context.Context, id string, val bool) error
	IsUserBlocked(ctx context.Context, id string) (bool, error)
	ChangeUserBlockStatus(ctx context.Context, id string, val bool) error
	ChangePassword(ctx context.Context, payload models.ChangePassword) error
	GetAdminPassword(ctx context.Context, id string) (string, error)
	AdminAgentStore
	AdminWalletStore
	AdminUserStore
	AdminSportsStore
	AdminReportsStore
	AdminSettingsStore
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

	query := `
	SELECT 
		a.id, 
		a.username, 
		a.name, 
		a.balance, 
		a.settlement, 
		a.child_level, 
		a.sports_share, 
		a.blocked, 
		a.market_commission, 
		a.session_commission,
		TO_CHAR(a.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at,
		ab.name AS added_by_name,
		ab.username AS added_by_username,
		ab.balance AS added_by_balance
	FROM 
		admins a
	LEFT JOIN 
		admins ab ON a.added_by = ab.id
	WHERE 
		a.id = $1;
	`

	err := s.db.QueryRow(ctx, query, id).Scan(
		&admin.ID,
		&admin.Username,
		&admin.Name,
		&admin.Balance,
		&admin.Settlement,
		&admin.ChildLevel,
		&admin.SportsShare,
		&admin.Blocked,
		&admin.MarketCommission,
		&admin.SessionCommission,
		&admin.CreatedAt,
		&admin.AddedByName,
		&admin.AddedByUserName,
		&admin.AddedByBalance,
	)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &admin, nil
}

func (s *adminStore) IsAdminBlocked(ctx context.Context, id string) (bool, error) {
	var blocked bool

	query := `SELECT blocked FROM admins WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&blocked)

	if err != nil {
		log.Println(err)
		return false, err
	}

	return blocked, nil
}

func (s *adminStore) ChangeAdminBlockStatus(ctx context.Context, id string, val bool) error {

	query := `UPDATE admins SET blocked = $1 WHERE id = $2`

	_, err := s.db.Exec(ctx, query, val, id)
	if err != nil {
		return fmt.Errorf("failed to update admin blocked status: %w", err)
	}

	return nil
}

func (s *adminStore) IsUserBlocked(ctx context.Context, id string) (bool, error) {
	var blocked bool

	query := `SELECT blocked FROM users WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&blocked)

	if err != nil {
		log.Println(err)
		return false, err
	}

	return blocked, nil
}

func (s *adminStore) ChangeUserBlockStatus(ctx context.Context, id string, val bool) error {

	query := `UPDATE users SET blocked = $1 WHERE id = $2`

	_, err := s.db.Exec(ctx, query, val, id)
	if err != nil {
		return fmt.Errorf("failed to update users blocked status: %w", err)
	}

	return nil
}

func (s *adminStore) ChangePassword(ctx context.Context, payload models.ChangePassword) error {

	query := `UPDATE admins SET password = $1 WHERE id = $2`

	_, err := s.db.Exec(ctx, query, payload.NewPassword, payload.ID)

	if err != nil {
		return fmt.Errorf("failed to change password: %w", err)
	}

	return nil
}

func (s *adminStore) GetAdminPassword(ctx context.Context, id string) (string, error) {

	var password string

	query := `SELECT password FROM admins WHERE id = $1`

	if err := s.db.QueryRow(ctx, query, id).Scan(&password); err != nil {
		return "", fmt.Errorf("failed to get value: %w", err)
	}

	return password, nil
}
