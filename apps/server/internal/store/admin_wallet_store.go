package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
)

type AdminWalletStore interface {
	GetBalance(ctx context.Context, id string) (float64, error)
	// CreditBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error
	// DebitBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error
	TransferBalance(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error
	TransferBalanceToUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error
	RecordUserTransaction(ctx context.Context, tx pgx.Tx, from, to, remarks, txnType, walletType string, amount float64) error
	RecordAdminTransaction(ctx context.Context, tx pgx.Tx, payload models.TransferCredit, txnType, walletType string) error
	DebitBalanceFromUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error
	Settlementuser(ctx context.Context, tx pgx.Tx, payload models.SettlementRequest) error
	Settlementagent(ctx context.Context, tx pgx.Tx, payload models.SettlementRequest) error
}

func (s *adminStore) GetBalance(ctx context.Context, id string) (float64, error) {

	var balance float64

	query := `SELECT balance FROM admins WHERE id = $1`
	err := s.db.QueryRow(ctx, query, id).Scan(&balance)

	if err != nil {
		return 0, err
	}

	return balance, nil
}

// func (s *adminStore) CreditBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error {

// 	query := `UPDATE admins SET balance = balance + $1 WHERE id = $2`

// 	_, err := tx.Exec(ctx, query, balance, id)

// 	if err != nil {
// 		return err
// 	}

// 	return nil

// }

// func (s *adminStore) DebitBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error {
// 	query := `
// 		UPDATE admins
// 		SET balance = balance - $1
// 		WHERE id = $2 AND balance >= $1
// 	`

// 	result, err := tx.Exec(ctx, query, balance, id)
// 	if err != nil {
// 		return fmt.Errorf("failed to debit balance: %w", err)
// 	}

// 	rowsAffected := result.RowsAffected()

// 	if rowsAffected == 0 {
// 		return fmt.Errorf("insufficient balance for debit operation")
// 	}

// 	return nil
// }

func (s *adminStore) TransferBalance(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error {
	if amount <= 0 {
		return fmt.Errorf("invalid transfer amount: %f", amount)
	}

	debitQuery := `
		UPDATE admins 
		SET balance = balance - $1
		WHERE id = $2 AND balance >= $1
	`
	debitResult, err := tx.Exec(ctx, debitQuery, amount, fromID)
	if err != nil {
		return fmt.Errorf("failed to debit balance: %w", err)
	}

	if debitResult.RowsAffected() == 0 {
		return fmt.Errorf("insufficient balance in account %s for transfer", fromID)
	}

	creditQuery := `
		UPDATE admins 
		SET balance = balance + $1,
		credit_ref = credit_ref + $1
		WHERE id = $2
	`
	creditResult, err := tx.Exec(ctx, creditQuery, amount, toID)
	if err != nil {
		return fmt.Errorf("failed to credit balance: %w", err)
	}

	if creditResult.RowsAffected() == 0 {
		return fmt.Errorf("failed to credit balance to account %s", toID)
	}

	return nil
}

func (s *adminStore) TransferBalanceToUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error {
	if amount <= 0 {
		return fmt.Errorf("invalid transfer amount: %f", amount)
	}

	debitQuery := `
		UPDATE admins 
		SET balance = balance - $1
		WHERE id = $2 AND balance >= $1
	`
	debitResult, err := tx.Exec(ctx, debitQuery, amount, fromID)
	if err != nil {
		return fmt.Errorf("failed to debit balance: %w", err)
	}

	if debitResult.RowsAffected() == 0 {
		return fmt.Errorf("insufficient balance in account %s for transfer", fromID)
	}

	creditQuery := `
		UPDATE users 
		SET balance = balance + $1,
		credit_ref = credit_ref + $1
		WHERE id = $2
	`
	creditResult, err := tx.Exec(ctx, creditQuery, amount, toID)
	if err != nil {
		return fmt.Errorf("failed to credit balance: %w", err)
	}

	if creditResult.RowsAffected() == 0 {
		return fmt.Errorf("failed to credit balance to account %s", toID)
	}

	return nil
}

func (s *adminStore) DebitBalanceFromUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error {
	if amount <= 0 {
		return fmt.Errorf("invalid transfer amount: %f", amount)
	}

	debitQuery := `
		UPDATE users 
		SET balance = balance - $1,
		credit_ref = credit_ref - $1
		WHERE id = $2 AND balance >= $1
	`
	debitResult, err := tx.Exec(ctx, debitQuery, amount, fromID)
	if err != nil {
		return fmt.Errorf("failed to debit balance: %w", err)
	}

	if debitResult.RowsAffected() == 0 {
		return fmt.Errorf("insufficient balance in account %s for transfer", fromID)
	}

	creditQuery := `
		UPDATE admins 
		SET balance = balance + $1 
		WHERE id = $2
	`
	creditResult, err := tx.Exec(ctx, creditQuery, amount, toID)
	if err != nil {

		return fmt.Errorf("failed to credit balance: %w", err)
	}

	if creditResult.RowsAffected() == 0 {
		return fmt.Errorf("failed to credit balance to account %s", toID)
	}

	return nil
}

func (s *adminStore) RecordUserTransaction(ctx context.Context, tx pgx.Tx, from, to, remarks, txnType, walletType string, amount float64) error {

	query := `INSERT INTO user_txns (user_id, admin_id, amount, remarks, txn_type, wallet_type)
	VALUES ($1, $2, $3, $4, $5, $6)`

	if _, err := tx.Exec(ctx, query, to, from, amount, remarks, txnType, walletType); err != nil {
		return fmt.Errorf("failed to record transaction : %w", err)
	}

	return nil
}

func (s *adminStore) RecordAdminTransaction(ctx context.Context, tx pgx.Tx, payload models.TransferCredit, txnType, walletType string) error {

	query := `INSERT INTO admin_txns (from_id, to_id, amount, remarks, txn_type, wallet_type)
	VALUES ($1, $2, $3, $4, $5, $6)`

	if _, err := tx.Exec(ctx, query, payload.From, payload.To, payload.Amount, payload.Remarks, txnType, walletType); err != nil {
		return fmt.Errorf("failed to record transaction : %w", err)
	}

	return nil
}

func (s *adminStore) Settlementuser(ctx context.Context, tx pgx.Tx, payload models.SettlementRequest) error {

	debitQuery := `UPDATE users SET settlement = settlement - $1 WHERE id = $2`

	debitResult, err := tx.Exec(ctx, debitQuery, payload.Cash, payload.ToId)

	if err != nil {
		return err
	}

	if debitResult.RowsAffected() == 0 {
		return fmt.Errorf("no user record updated during debit operation")
	}

	creditQuery := `UPDATE admins SET settlement = settlement + $1 WHERE id = $2`

	creditResult, err := tx.Exec(ctx, creditQuery, payload.Cash, payload.FromId)

	if err != nil {
		return err
	}

	if creditResult.RowsAffected() == 0 {
		return fmt.Errorf("no admin record updated during credit operation")
	}

	return nil
}

func (s *adminStore) Settlementagent(ctx context.Context, tx pgx.Tx, payload models.SettlementRequest) error {

	debitQuery := `UPDATE admins SET settlement = settlement - $1 WHERE id = $2`

	debitResult, err := tx.Exec(ctx, debitQuery, payload.Cash, payload.ToId)

	if err != nil {
		return err
	}

	if debitResult.RowsAffected() == 0 {
		return fmt.Errorf("no user record updated during debit operation")
	}

	creditQuery := `UPDATE admins SET settlement = settlement + $1 WHERE id = $2`

	creditResult, err := tx.Exec(ctx, creditQuery, payload.Cash, payload.FromId)

	if err != nil {
		return err
	}

	if creditResult.RowsAffected() == 0 {
		return fmt.Errorf("no admin record updated during credit operation")
	}

	return nil
}
