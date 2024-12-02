package store

import (
	"context"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	GetBalance(ctx context.Context, id string) (float64, error)
	UserDetails(ctx context.Context, id string) (*models.User, error)
}

type userStore struct {
	*BaseStore
}

func NewUserStore(db *pgxpool.Pool) UserStore {
	return &userStore{BaseStore: NewBaseStore(db)}
}

func (s *userStore) UserDetails(ctx context.Context, id string) (*models.User, error) {

	var user models.User

	query := `SELECT id, username, name, balance, market_commission, session_commission,
	TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at
	FROM users WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Name,
		&user.Balance,
		&user.MarketCommission,
		&user.SessionCommission,
		&user.CreatedAt)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &user, nil

}

func (s *userStore) GetBalance(ctx context.Context, id string) (float64, error) {

	var balance float64

	query := `SELECT balance FROM users WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&balance)

	if err != nil {
		return 0, err
	}

	return balance, nil
}
