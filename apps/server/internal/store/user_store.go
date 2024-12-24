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
	GetUserTxns(ctx context.Context, id, from, to string) ([]models.Transactions, error)
	GetUserBets(ctx context.Context, id, gameType, marketType, from, to string) ([]models.Bet, error)
}

type userStore struct {
	*BaseStore
}

func NewUserStore(db *pgxpool.Pool) UserStore {
	return &userStore{BaseStore: NewBaseStore(db)}
}

func (s *userStore) UserDetails(ctx context.Context, id string) (*models.User, error) {

	var user models.User

	query := `SELECT 
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

func (s *userStore) GetUserTxns(ctx context.Context, id string, from string, to string) ([]models.Transactions, error) {

	var txns []models.Transactions

	query := `SELECT amount, txn_type, TO_CHAR(created_at AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at
	FROM user_txns WHERE user_id = $1
	AND created_at BETWEEN $2 AND $3`

	rows, err := s.db.Query(ctx, query, id, from, to)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var txn models.Transactions

		if err := rows.Scan(&txn.Amount, &txn.TransactionType, &txn.CreatedAt); err != nil {
			return nil, err
		}

		txns = append(txns, txn)

	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return txns, nil
}

func (s *userStore) GetUserBets(ctx context.Context, id, gameType, marketType, from, to string) ([]models.Bet, error) {
	var history []models.Bet

	query := `SELECT market_name, market_type, runner_name, profit, exposure, result, odds_price, odds_rate,
              TO_CHAR(created_at AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at
              FROM sport_bets
              WHERE settled = true
              AND user_id = $1
              AND created_at BETWEEN $2 AND $3
			  ORDER BY created_at DESC`

	args := []interface{}{id, from, to}

	if gameType != "all" {
		query += ` AND match_id = $4`
		args = append(args, gameType)
	}

	if marketType != "all" {
		if gameType != "all" {
			query += ` AND market_type = $5`
			args = append(args, marketType)
		} else {
			query += ` AND market_type = $4`
			args = append(args, marketType)
		}
	}
	rows, err := s.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var bet models.Bet
		if err := rows.Scan(
			&bet.MarketName,
			&bet.MarketType,
			&bet.RunnerName,
			&bet.Profit,
			&bet.Exposure,
			&bet.Result,
			&bet.OddsPrice,
			&bet.OddsRate,
			&bet.CreatedAt,
		); err != nil {
			return nil, err
		}
		history = append(history, bet)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return history, nil
}
