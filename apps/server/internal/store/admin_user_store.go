package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
)

type AdminUserStore interface {
	CreateUser(ctx context.Context, tx pgx.Tx, payload models.CreateUser) (string, error)
	GetUsersList(ctx context.Context, id string) (*[]models.List, error)
	EditUser(ctx context.Context, payload models.EditUser) error
}

func (s *adminStore) CreateUser(ctx context.Context, tx pgx.Tx, payload models.CreateUser) (string, error) {
	var id string
	query := `INSERT INTO users (username, name, password, market_commission, session_commission, added_by)
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	if err := tx.QueryRow(ctx, query,
		payload.Username,
		payload.Name,
		payload.Password,
		payload.MarketCommission,
		payload.SessionCommission,
		payload.AddedBy,
	).Scan(&id); err != nil {
		return "", fmt.Errorf("failed to create user: %w", err)
	}

	downLineQuery := `UPDATE admins SET downline = downline + 1 WHERE id = $1`

	if _, err := tx.Exec(ctx, downLineQuery, payload.AddedBy); err != nil {
		return "", fmt.Errorf("failed to create agent: %w", err)
	}

	return id, nil
}

func (s *adminStore) GetUsersList(ctx context.Context, id string) (*[]models.List, error) {
	var users []models.List

	query := `SELECT id, name, username, 
	ROUND(balance::numeric, 2) AS balance, 
	ROUND(exposure::numeric, 2) AS exposure,
	ROUND(settlement::numeric, 2) AS settlement,
    ROUND(credit_ref::numeric + settlement::numeric, 2) AS pnl,
	credit_ref,
	'C' AS role,  
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
		var user models.List
		if err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Username,
			&user.Balance,
			&user.Exposure,
			&user.Settlement,
			&user.PnL,
			&user.CreditRef,
			// &user.AvailableBalance,
			&user.Role,
			&user.CreatedAt,
		); err != nil {
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
