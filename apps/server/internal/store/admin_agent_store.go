package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
)

type AdminAgentStore interface {
	GetAdminByUsername(ctx context.Context, username string) (*models.Admin, error)
	GetAgentsList(ctx context.Context, id string, childLevel int) (*[]models.Admin, error)
	CreateAgent(ctx context.Context, tx pgx.Tx, payload models.CreateAgent) (string, error)
	TransferSportsShare(ctx context.Context, tx pgx.Tx, from, to string, share int64) error
	EditAdmin(ctx context.Context, id, name string) error
	GetAdminWalllets(ctx context.Context, id string) (*models.Admin, error)
}

func (s *adminStore) GetAdminByUsername(ctx context.Context, username string) (*models.Admin, error) {
	var admin models.Admin
	query := `SELECT id, name, username, password, sports_share, child_level 
	FROM admins 
	WHERE username = $1 AND blocked = false`
	err := s.db.QueryRow(ctx, query, username).Scan(&admin.ID, &admin.Name, &admin.Username, &admin.Password, &admin.SportsShare, &admin.ChildLevel)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (s *adminStore) GetAgentsList(ctx context.Context, id string, childLevel int) (*[]models.Admin, error) {
	var admins []models.Admin

	query := `SELECT id, name, username, balance, 
	TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at 
	FROM admins
	WHERE child_level < $1 AND added_by = $2
	ORDER BY created_at DESC;`

	rows, err := s.db.Query(ctx, query, childLevel, id)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var admin models.Admin
		if err := rows.Scan(&admin.ID, &admin.Name, &admin.Username, &admin.Balance, &admin.CreatedAt); err != nil {
			return nil, err
		}
		admins = append(admins, admin)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &admins, nil
}

func (s *adminStore) CreateAgent(ctx context.Context, tx pgx.Tx, payload models.CreateAgent) (string, error) {

	query := `INSERT INTO admins (name, username, password, added_by, child_level, market_commission, session_commission) 
	VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`

	var id string

	err := tx.QueryRow(ctx, query,
		payload.Name,
		payload.UserName,
		payload.Password,
		payload.AddedBy,
		payload.ChildLevel,
		payload.MarketCommission,
		payload.SessionCommission,
	).Scan(&id)
	if err != nil {

		return "", fmt.Errorf("failed to create agent: %w", err)
	}

	return id, nil

}

func (s *adminStore) TransferSportsShare(ctx context.Context, tx pgx.Tx, from, to string, share int64) error {

	query := `
		UPDATE admins 
		SET 
			sports_share = CASE 
				WHEN id = $2 THEN sports_share + $1
				WHEN id = $3 AND sports_share >= $1 THEN sports_share - $1
				ELSE sports_share
			END
		WHERE id IN ($2, $3)
	`

	result, err := tx.Exec(ctx, query, share, to, from)
	if err != nil {
		return fmt.Errorf("failed to update sports_share: %w", err)
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return fmt.Errorf("no rows updated; insufficient sports_share for the decrement or invalid IDs")
	}

	return nil

}

func (s *adminStore) EditAdmin(ctx context.Context, id, name string) error {

	query := `UPDATE admins SET name = $1 WHERE id = $2`

	_, err := s.db.Exec(ctx, query, name, id)

	if err != nil {
		return fmt.Errorf("failed to update admin: %w", err)
	}

	return nil
}

func (s *adminStore) GetAdminWalllets(ctx context.Context, id string) (*models.Admin, error) {

	var admin models.Admin

	query := `SELECT id, settlement, balance FROM admins WHERE id = $1`

	err := s.db.QueryRow(ctx, query, id).Scan(&admin.ID, &admin.Settlement, &admin.Balance)

	if err != nil {
		return nil, err
	}

	return &admin, nil
}
