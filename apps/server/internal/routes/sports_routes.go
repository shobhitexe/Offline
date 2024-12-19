package routes

import (
	"server/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func RegisterSportsRoutes(r chi.Router, h *handlers.SportsHandler) {

	r.Route("/sports", func(r chi.Router) {

		// r.Get("/getList", h.GetList)
		// r.Get("/listEvents", h.ListEvents)
		// r.Get("/getEventDetail", h.GetEventDetail)
		// r.Get("/getMarketList", h.GetMarketList)

		//frontend

		r.Get("/getActiveEvents", h.GetActiveEvents)

		r.Get("/matchodds", h.GetMatchOdds)

		r.Get("/inplay", h.GetInPlayEvents)
		r.Get("/getEventDetail", h.GetEventDetail)

		r.Post("/placebet", h.PlaceBet)

		r.Get("/bethistory/pergame", h.BetHistoryPerGame)

		r.Get("/matchsettings", h.GetMatchSettings)

	})

}
