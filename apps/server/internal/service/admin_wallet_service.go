package service

import (
	"context"
	"fmt"
	"math"
	"server/internal/models"
)

type AdminWalletService interface {
	GetBalance(ctx context.Context, id string) (float64, error)
	TransferCreditToUser(ctx context.Context, payload models.TransferCredit) error
	DebitFromUser(ctx context.Context, payload models.TransferCredit) error
	TransferCreditToAdmin(ctx context.Context, payload models.TransferCredit) error
	DebitFromAdmin(ctx context.Context, payload models.TransferCredit) error
	Settlementuser(ctx context.Context, payload models.SettlementRequest) error
	Settlementagent(ctx context.Context, payload models.SettlementRequest) error
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

	if err := a.store.RecordUserTransaction(ctx, tx, payload.From, payload.To, payload.Remarks, "credit", "credit", payload.Amount); err != nil {
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

	if err := a.store.RecordUserTransaction(ctx, tx, payload.To, payload.From, payload.Remarks, "debit", "credit", payload.Amount); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (a *adminService) TransferCreditToAdmin(ctx context.Context, payload models.TransferCredit) error {

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

	if err := a.store.TransferBalance(ctx, tx, payload.From, payload.To, payload.Amount); err != nil {
		return err
	}

	if err := a.store.RecordAdminTransaction(ctx, tx, payload, "credit", "cash"); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (a *adminService) DebitFromAdmin(ctx context.Context, payload models.TransferCredit) error {

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

	if err := a.store.TransferBalance(ctx, tx, payload.From, payload.To, payload.Amount); err != nil {
		return err
	}

	if err := a.store.RecordAdminTransaction(ctx, tx, payload, "debit", "cash"); err != nil {
		return err
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (s *adminService) Settlementuser(ctx context.Context, payload models.SettlementRequest) error {

	tx, err := s.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			if rErr := tx.Rollback(ctx); rErr != nil {
				fmt.Printf("Rollback failed: %v\n", rErr)
			}
			panic(p)
		} else if err != nil {
			if rErr := tx.Rollback(ctx); rErr != nil {
				fmt.Printf("Rollback failed: %v\n", rErr)
			}
		}
	}()

	switch payload.TxnType {
	case "credit":
		payload.Cash = -payload.Cash

	}

	if err := s.store.Settlementuser(ctx, tx, payload); err != nil {
		return fmt.Errorf("Failed to do settlement: %w", err)
	}

	payload.Cash = math.Abs(payload.Cash)

	if err := s.store.RecordUserTransaction(ctx, tx, payload.FromId, payload.ToId, payload.Remarks, payload.TxnType, "cash", payload.Cash); err != nil {
		return fmt.Errorf("Failed to record transaction: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (s *adminService) Settlementagent(ctx context.Context, payload models.SettlementRequest) error {

	tx, err := s.store.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			if rErr := tx.Rollback(ctx); rErr != nil {
				fmt.Printf("Rollback failed: %v\n", rErr)
			}
			panic(p)
		} else if err != nil {
			if rErr := tx.Rollback(ctx); rErr != nil {
				fmt.Printf("Rollback failed: %v\n", rErr)
			}
		}
	}()

	switch payload.TxnType {
	case "credit":
		payload.Cash = -payload.Cash

	}

	if err := s.store.Settlementagent(ctx, tx, payload); err != nil {
		return fmt.Errorf("Failed to do settlement: %w", err)
	}

	payload.Cash = math.Abs(payload.Cash)

	history := models.TransferCredit{
		Amount:  payload.Cash,
		From:    payload.FromId,
		To:      payload.ToId,
		Remarks: payload.Remarks,
	}

	if err := s.store.RecordAdminTransaction(ctx, tx, history, payload.TxnType, "cash"); err != nil {
		return fmt.Errorf("Failed to record transaction: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
