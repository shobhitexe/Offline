package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterAdminRoutes(r chi.Router, h *handlers.AdminHandler) {

	r.Route("/admin", func(r chi.Router) {

		//auth
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", h.HandleLogin)
		})

	})

}
