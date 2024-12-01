package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterUserRoutes(r chi.Router, h *handlers.UserHandler) {

	r.Route("/user", func(r chi.Router) {

		r.Get("/", h.UserDetails)

		//wallet
		r.Route("/wallet", func(r chi.Router) {
			r.Get("/balance", h.WalletBalance)
		})

	})

}
