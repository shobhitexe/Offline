package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterAdminRoutes(r chi.Router, h *handlers.AdminHandler) {

	r.Route("/admin", func(r chi.Router) {

		r.Get("/", h.AdminDetails)

		//auth
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", h.HandleLogin)
		})

		//wallet
		r.Route("/wallet", func(r chi.Router) {
			r.Get("/balance", h.WalletBalance)

			// Credit debit for user
			r.Post("/credit/user", h.TransferCreditUser)
			r.Post("/debit/user", h.DebitUser)

			// Credit debit for agents
			r.Post("/credit/admin", h.CreditAdmin)
			r.Post("/debit/admin", h.DebitAdmin)
		})

		//agent
		r.Route("/agent", func(r chi.Router) {
			r.Get("/list", h.GetAgentList)
			r.Post("/create", h.CreateAgent)
		})

		//user
		r.Route("/user", func(r chi.Router) {
			r.Get("/list", h.GetUsersList)
			r.Post("/create", h.CreateUser)
		})

	})

}
