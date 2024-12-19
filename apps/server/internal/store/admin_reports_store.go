package store

import (
	"context"
	"server/internal/models"
)

type AdminReportsStore interface {
	GetSettledBetsUsers(ctx context.Context, ids []string) (*[]models.PerUserBalanceSheetReport, error)
	BatchTotalAddedAdmin(ctx context.Context, ids []string) (map[string]int64, error)
	CalculateCashParent(ctx context.Context, id string) (float64, error)
	CalculateCashChild(ctx context.Context, id string) (float64, error)
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

	defer rows.Close()

	for rows.Next() {
		var u models.PerUserBalanceSheetReport
		rows.Scan(&u.UserID, &u.UserName, &u.Name, &u.Settlement, &u.Result)
		report = append(report, u)
	}

	return &report, nil
}

func (s *adminStore) BatchTotalAddedAdmin(ctx context.Context, ids []string) (map[string]int64, error) {
	query := `SELECT id, COUNT(*) AS admin_count FROM admins WHERE added_by IN ($1) GROUP BY id`
	rows, err := s.db.Query(ctx, query, ids)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	results := make(map[string]int64)
	for rows.Next() {
		var id string
		var count int64
		if err := rows.Scan(&id, &count); err != nil {
			return nil, err
		}
		results[id] = count
	}
	return results, nil
}

func (s *adminStore) CalculateCashParent(ctx context.Context, id string) (float64, error) {

	var total float64

	query := `SELECT COALESCE(SUM(amount), 0) AS total_amount
			  FROM admin_txns
			  WHERE from_id = $1
              AND wallet_type = 'cash'`

	if err := s.db.QueryRow(ctx, query, id).Scan(&total); err != nil {
		return 0, nil
	}

	return total, nil

}

func (s *adminStore) CalculateCashChild(ctx context.Context, id string) (float64, error) {

	var total float64

	query := `SELECT COALESCE(SUM(amount), 0) AS total_amount
			  FROM admin_txns
			  WHERE to_id = $1
              AND wallet_type = 'cash'`

	if err := s.db.QueryRow(ctx, query, id).Scan(&total); err != nil {
		return 0, nil
	}

	return total, nil

}
