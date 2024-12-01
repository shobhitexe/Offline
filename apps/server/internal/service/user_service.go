package service

import (
	"context"
	"server/internal/models"
	"server/internal/store"
)

type UserService interface {
	UserDetails(ctx context.Context, id string) (*models.User, error)
	GetBalance(ctx context.Context, id string) (float64, error)
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

func (s *userService) GetBalance(ctx context.Context, id string) (float64, error) {

	bal, err := s.store.GetBalance(ctx, id)

	if err != nil {
		return 0, err
	}

	return bal, err

}
