package service

import (
	"context"
	"errors"
	"log"
	"server/internal/models"
	"server/internal/store"
	"sort"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	UserDetails(ctx context.Context, id string) (*models.User, error)
	GetBalance(ctx context.Context, id string) (*models.UserWallet, error)
	SignIn(ctx context.Context, payload models.SignInRequest) (*models.User, error)
	GetStatement(ctx context.Context, paylod models.StatementRequest) ([]models.AccountStatement, error)
}

type userService struct {
	store store.UserStore
}

func NewUserService(store store.UserStore) UserService {
	return &userService{store: store}
}

func (s *userService) UserDetails(ctx context.Context, id string) (*models.User, error) {

	user, err := s.store.UserDetails(ctx, id)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) GetBalance(ctx context.Context, id string) (*models.UserWallet, error) {

	bal, err := s.store.GetBalance(ctx, id)

	if err != nil {
		return nil, err
	}

	return bal, err

}

func (s *userService) SignIn(ctx context.Context, payload models.SignInRequest) (*models.User, error) {

	user, err := s.store.GetUserFromUsername(ctx, payload.Username)

	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	go func() {
		backgroundCtx := context.Background()
		if err := s.store.RecordLoginHistory(backgroundCtx, user.ID, "user", payload.LoginIP, payload.UserAgent); err != nil {
			log.Printf("failed to record login history: %v", err)
		}
	}()

	return user, nil
}

func (s *userService) GetStatement(ctx context.Context, paylod models.StatementRequest) ([]models.AccountStatement, error) {

	var wg sync.WaitGroup
	var txnsErr error
	var betsErr error

	var txns []models.Transactions
	var bets []models.Bet

	if paylod.GameType == "all" && paylod.MarketType == "all" {
		wg.Add(1)
		go func() {
			defer wg.Done()
			txns, txnsErr = s.store.GetUserTxns(ctx, paylod.ID, paylod.FromDate, paylod.ToDate)
		}()
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		bets, betsErr = s.store.GetUserBets(ctx, paylod.ID, paylod.GameType, paylod.MarketType, paylod.FromDate, paylod.ToDate)
	}()

	wg.Wait()

	if txnsErr != nil {
		return nil, txnsErr
	}

	if betsErr != nil {
		return nil, betsErr
	}

	var statement []models.AccountStatement

	if paylod.GameType == "all" && paylod.MarketType == "all" {
		for _, txn := range txns {

			var credit float64
			var debit float64
			var txnType string

			if txn.TransactionType == "credit" {
				credit = txn.Amount
				txnType = "Deposit"
			} else {
				debit = txn.Amount
				txnType = "Withdraw"
			}

			item := models.AccountStatement{
				Credit:          credit,
				Debit:           debit,
				TransactionType: txnType,
				CreatedAt:       txn.CreatedAt,
			}
			statement = append(statement, item)
		}
	}

	for _, bet := range bets {

		var credit float64
		var debit float64

		// games := map[string]string{
		// 	"1": "Football",
		// 	"2": "Tennis",
		// 	"4": "Cricket",
		// }

		if bet.Result == "win" {
			credit = bet.Profit
		} else {
			debit = bet.Exposure
		}

		item := models.AccountStatement{
			Credit: credit,
			Debit:  debit,
			// TransactionType: games[bet.MatchId],
			MatchName:  bet.MarketName,
			MarketType: bet.MarketType,
			RunnerName: bet.RunnerName,
			CreatedAt:  bet.CreatedAt,
		}
		statement = append(statement, item)
	}

	const dateFormat = "02/01/2006, 03:04:05"

	sort.Slice(statement, func(i, j int) bool {
		timeI, err := time.Parse(dateFormat, statement[i].CreatedAt)
		if err != nil {
			log.Printf("Failed to parse CreatedAt for statement[%d]: %v", i, err)
			return false
		}
		timeJ, err := time.Parse(dateFormat, statement[j].CreatedAt)
		if err != nil {
			log.Printf("Failed to parse CreatedAt for statement[%d]: %v", j, err)
			return true
		}
		return timeI.After(timeJ)
	})

	return statement, nil
}
