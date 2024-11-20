package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterHealthRoutes(r chi.Router, h *handlers.HealthHandler) {

	r.Route("/health", func(r chi.Router) {
		r.Get("/", h.CheckHealth)
	})

}
