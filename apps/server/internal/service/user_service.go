package service

import (
	"context"
	"errors"
	"log"
	"server/internal/models"
	"server/internal/store"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	UserDetails(ctx context.Context, id string) (*models.User, error)
	GetBalance(ctx context.Context, id string) (*models.UserWallet, error)
	SignIn(ctx context.Context, payload models.SignInRequest) (*models.User, error)
	GetStatement(ctx context.Context, paylod models.StatementRequest) (any, error)
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

func (s *userService) GetStatement(ctx context.Context, paylod models.StatementRequest) (any, error) {

	return nil, nil
}
