package service

import "server/internal/store"

type SportsService interface{}

type sportsService struct {
	store *store.SportsStore
}

func NewSportsService(store store.SportsStore) SportsService {
	return &sportsService{
		store: &store,
	}
}
