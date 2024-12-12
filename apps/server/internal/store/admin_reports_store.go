package store

import (
	"context"
	"server/internal/models"
)

type AdminReportsStore interface {
	GetSettledBetsUsers(ctx context.Context, ids []string) (*[]models.PerUserBalanceSheetReport, error)
}

func (s *adminStore) GetSettledBetsUsers(ctx context.Context, ids []string) (*[]models.PerUserBalanceSheetReport, error) {

	var report []models.PerUserBalanceSheetReport

	query := `SELECT sb.user_id, u.username, u.name, sb.profit, sb.settlement 
	FROM sport_bets sb 
	JOIN users u ON sb.user_id = u.id 
	WHERE sb.settled = true AND sb.user_id = ANY($1::int[])`

	rows, err := s.db.Query(ctx, query, ids)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var u models.PerUserBalanceSheetReport
		rows.Scan(&u.UserID, &u.UserName, &u.Name, &u.Settlement, &u.Result)
		report = append(report, u)
	}

	return &report, nil
}
