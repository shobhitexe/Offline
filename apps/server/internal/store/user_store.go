package store

import (
	"context"
	"fmt"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	GetBalance(ctx context.Context, id string) (*models.UserWallet, error)
	UserDetails(ctx context.Context, id string) (*models.User, error)
	GetUserFromUsername(ctx context.Context, username string) (*models.User, error)
	RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error
}

type userStore struct {
	*BaseStore
}

func NewUserStore(db *pgxpool.Pool) UserStore {
	return &userStore{BaseStore: NewBaseStore(db)}
}

func (s *userStore) UserDetails(ctx context.Context, id string) (*models.User, error) {

	var user models.User

	query := `
			SELECT 
    			u.id, 
    			u.username, 
    			u.name, 
    			u.balance, 
    			u.market_commission, 
    			u.session_commission,
    			TO_CHAR(u.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at,
    			a.name AS added_by_name,
    			a.username AS added_by_username,
    			a.balance AS added_by_balance
			FROM 
			    users u
			LEFT JOIN 
			    admins a ON u.added_by = a.id
			WHERE 
			    u.id = $1`

	err := s.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Name,
		&user.Balance,
		&user.MarketCommission,
		&user.SessionCommission,
		&user.CreatedAt,
		&user.AddedByName,
		&user.AddedByUserName,
		&user.AddedByBalance,
	)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &user, nil

}

func (s *userStore) GetBalance(ctx context.Context, id string) (*models.UserWallet, error) {

	var wallet models.UserWallet

	query := `SELECT balance, exposure FROM users WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&wallet.Balance, &wallet.Exposure)

	if err != nil {
		return nil, err
	}

	return &wallet, nil
}

func (s userStore) GetUserFromUsername(ctx context.Context, username string) (*models.User, error) {

	var user models.User

	query := `SELECT id, username, name, password FROM users WHERE username = $1 AND blocked = false`

	err := s.db.QueryRow(ctx, query, username).Scan(&user.ID, &user.Username, &user.Name, &user.Password)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &user, nil
}

func (s *userStore) RecordLoginHistory(ctx context.Context, userId, userType, loginIp, userAgent string) error {

	query := `INSERT INTO login_histories (user_id, user_type, login_ip, user_agent)
	VALUES ($1, $2, $3, $4)`

	_, err := s.db.Exec(ctx, query, userId, userType, loginIp, userAgent)
	if err != nil {
		return fmt.Errorf("failed to record login history: %w", err)
	}

	return nil

}
