package handlers

import (
	"net/http"
	"server/internal/models"
	"server/pkg/utils"
)

type HealthHandler struct{ utils utils.Utils }

func NewHealthHandler(utils utils.Utils) *HealthHandler {
	return &HealthHandler{utils: utils}
}

func (h *HealthHandler) CheckHealth(w http.ResponseWriter, r *http.Request) {
	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Everything is fine here", Data: true})
}
