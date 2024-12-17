package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterHealthRoutes(r chi.Router, h *handlers.HealthHandler) {

	r.Get("/health", h.CheckHealth)

}
