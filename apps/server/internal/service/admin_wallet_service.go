package service

import (
	"context"
	"fmt"
	"server/internal/models"
)

type AdminWalletService interface {
	GetBalance(ctx context.Context, id string) (float64, error)
	TransferCreditToUser(ctx context.Context, payload models.TransferCredit) error
	DebitFromUser(ctx context.Context, payload models.TransferCredit) error
}

func (a *adminService) GetBalance(ctx context.Context, id string) (float64, error) {

	bal, err := a.store.GetBalance(ctx, id)

	if err != nil {
		return 0, err
	}

	return bal, err

}

func (a *adminService) TransferCreditToUser(ctx context.Context, payload models.TransferCredit) error {

	tx, err := a.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		} else if err != nil {
			_ = tx.Rollback(ctx)
		}
	}()

	if err := a.store.TransferBalanceToUser(ctx, tx, payload.From, payload.To, payload.Amount); err != nil {
		return err
	}

	if err := a.store.RecordCreditToUser(ctx, tx, payload); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (a *adminService) DebitFromUser(ctx context.Context, payload models.TransferCredit) error {

	tx, err := a.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		} else if err != nil {
			_ = tx.Rollback(ctx)
		}
	}()

	if err := a.store.DebitBalanceFromUser(ctx, tx, payload.From, payload.To, payload.Amount); err != nil {
		return err
	}

	if err := a.store.RecordDebitToUser(ctx, tx, payload); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
