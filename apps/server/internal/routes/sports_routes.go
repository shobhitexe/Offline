package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterSportsRoutes(r chi.Router, h *handlers.SportsHandler) {

	r.Route("/sports", func(r chi.Router) {

		r.Get("/getList", h.GetList)

	})

}
