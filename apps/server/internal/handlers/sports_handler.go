package handlers

import (
	"net/http"
	"server/internal/service"
)

type SportsHandler struct {
	service service.SportsService
}

func NewSportsHandler(service service.SportsService) *SportsHandler {
	return &SportsHandler{service: service}
}

func (h *SportsHandler) GetList(w http.ResponseWriter, r *http.Request) {}
