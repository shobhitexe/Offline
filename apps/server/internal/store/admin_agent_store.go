package store

import (
	"context"
	"fmt"
	"server/internal/models"
)

type AdminAgentStore interface {
	GetAgentsList(ctx context.Context) (*[]models.Admin, error)
	CreateAgent(ctx context.Context, payload models.CreateAgent) error
}

func (s *adminStore) GetAgentsList(ctx context.Context) (*[]models.Admin, error) {
	var admins []models.Admin

	query := `SELECT id, name, username, password, balance, 
	TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at 
	FROM admins`

	rows, err := s.db.Query(ctx, query)

	if err != nil {

		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var admin models.Admin
		if err := rows.Scan(&admin.ID, &admin.Name, &admin.Username, &admin.Password, &admin.Balance, &admin.CreatedAt); err != nil {
			return nil, err
		}
		admins = append(admins, admin)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &admins, nil
}

func (s *adminStore) CreateAgent(ctx context.Context, payload models.CreateAgent) error {

	query := `INSERT INTO admins (name, username, password, balance, added_by, child_level, sports_share, market_commission, session_commission) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	_, err := s.db.Exec(ctx, query, payload.Name, payload.UserName, payload.Password, payload.Credit, payload.AddedBy, payload.ChildLevel, payload.SportsShare, payload.MarketCommission, payload.SessionCommission)
	if err != nil {
		return fmt.Errorf("failed to create agent: %w", err)
	}

	return nil

}
