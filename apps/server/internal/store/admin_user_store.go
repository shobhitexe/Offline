package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
)

type AdminUserStore interface {
	CreateUser(ctx context.Context, tx pgx.Tx, payload models.CreateUser) error
	GetUsersList(ctx context.Context) (*[]models.User, error)
}

func (s *adminStore) CreateUser(ctx context.Context, tx pgx.Tx, payload models.CreateUser) error {

	query := `INSERT INTO users (username, name, password, balance, market_commission, session_commission, added_by)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`

	if _, err := tx.Exec(ctx, query, payload.Username, payload.Name, payload.Password, payload.Credit, payload.MarketCommission, payload.SessionCommission, payload.AddedBy); err != nil {
		return fmt.Errorf("Failed to create user ;%w", err)
	}

	return nil

}

func (s *adminStore) GetUsersList(ctx context.Context) (*[]models.User, error) {
	var users []models.User

	query := `SELECT id, name, username, balance, 
	TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at 
	FROM users
	ORDER BY created_at DESC;`

	rows, err := s.db.Query(ctx, query)

	if err != nil {

		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Username, &user.Balance, &user.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &users, nil
}
