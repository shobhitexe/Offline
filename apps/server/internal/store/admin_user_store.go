package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
)

type AdminUserStore interface {
	CreateUser(ctx context.Context, tx pgx.Tx, payload models.CreateUser) error
	GetUsersList(ctx context.Context, id int) (*[]models.User, error)
	EditUser(ctx context.Context, payload models.EditUser) error
}

func (s *adminStore) CreateUser(ctx context.Context, tx pgx.Tx, payload models.CreateUser) error {

	query := `INSERT INTO users (username, name, password, balance, market_commission, session_commission, added_by)
	VALUES ($1, $2, $3, $4, $5, $6, $7)`

	if _, err := tx.Exec(ctx, query, payload.Username, payload.Name, payload.Password, payload.Credit, payload.MarketCommission, payload.SessionCommission, payload.AddedBy); err != nil {
		return fmt.Errorf("Failed to create user ;%w", err)
	}

	return nil

}

func (s *adminStore) GetUsersList(ctx context.Context, id int) (*[]models.User, error) {
	var users []models.User

	query := `SELECT id, name, username, balance, exposure, 
	TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at 
	FROM users
	WHERE added_by = $1
	ORDER BY created_at DESC;`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {

		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Username, &user.Balance, &user.Exposure, &user.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &users, nil
}

func (s *adminStore) EditUser(ctx context.Context, payload models.EditUser) error {

	query := `UPDATE users SET name = $1, market_commission = $2 WHERE id = $3`

	_, err := s.db.Exec(ctx, query, payload.Name, payload.MarketCommission, payload.ID)

	if err != nil {
		return fmt.Errorf("Failed to update user: %w", err)
	}

	return nil
}
