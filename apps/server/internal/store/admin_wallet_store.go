package store

import (
	"context"
	"fmt"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
)

type AdminWalletStore interface {
	GetBalance(ctx context.Context, id string) (float64, error)
	CreditBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error
	DebitBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error
	TransferBalance(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error
	TransferBalanceToUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error
	RecordCreditToUser(ctx context.Context, tx pgx.Tx, payload models.TransferCredit) error
	RecordDebitToUser(ctx context.Context, tx pgx.Tx, payload models.TransferCredit) error
	DebitBalanceFromUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error
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

func (s *adminStore) CreditBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error {

	query := `UPDATE admins SET balance = balance + $1 WHERE id = $2`

	_, err := tx.Exec(ctx, query, balance, id)

	if err != nil {
		return err
	}

	return nil

}

func (s *adminStore) DebitBalance(ctx context.Context, tx pgx.Tx, id string, balance float64) error {
	query := `
		UPDATE admins 
		SET balance = balance - $1 
		WHERE id = $2 AND balance >= $1
	`

	result, err := tx.Exec(ctx, query, balance, id)
	if err != nil {
		return fmt.Errorf("failed to debit balance: %w", err)
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return fmt.Errorf("insufficient balance for debit operation")
	}

	return nil
}

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

func (s *adminStore) DebitBalanceFromUser(ctx context.Context, tx pgx.Tx, fromID, toID string, amount float64) error {
	if amount <= 0 {
		return fmt.Errorf("invalid transfer amount: %f", amount)
	}

	debitQuery := `
		UPDATE users 
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

func (s *adminStore) RecordCreditToUser(ctx context.Context, tx pgx.Tx, payload models.TransferCredit) error {

	query := `INSERT INTO user_credits (user_id, admin_id, amount, remarks, txn_type)
	VALUES ($1, $2, $3, $4, $5)`

	if _, err := tx.Exec(ctx, query, payload.To, payload.From, payload.Amount, payload.Remarks, "credit"); err != nil {
		return fmt.Errorf("failed to record transaction : %w", err)
	}

	return nil
}

func (s *adminStore) RecordDebitToUser(ctx context.Context, tx pgx.Tx, payload models.TransferCredit) error {

	query := `INSERT INTO user_credits (user_id, admin_id, amount, remarks, txn_type)
	VALUES ($1, $2, $3, $4, $5)`

	if _, err := tx.Exec(ctx, query, payload.From, payload.To, payload.Amount, payload.Remarks, "debit"); err != nil {
		return fmt.Errorf("failed to record transaction : %w", err)
	}

	return nil
}
