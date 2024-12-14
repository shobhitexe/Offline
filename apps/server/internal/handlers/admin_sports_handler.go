package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) GetActiveBetsListByMarketID(w http.ResponseWriter, r *http.Request) {

	params := r.URL.Query()

	eventId := params.Get("eventId")

	if len(eventId) == 0 || eventId == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no Event ID provided",
			Data:    "[]",
		})
		return
	}

	data, err := h.service.GetActiveBetsListByMarketID(r.Context(), eventId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed",
			Data:    err.Error(),
		})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: data})

}

func (h *AdminHandler) BetHistoryPerGame(w http.ResponseWriter, r *http.Request) {

	params := r.URL.Query()

	eventId := params.Get("eventId")

	if len(eventId) == 0 || eventId == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "No event id provided", Data: false})
		return
	}

	data, grouped, err := h.service.GetBetHistoryPerGame(r.Context(), eventId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to fetch bets", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: map[string]any{
		"history": data,
		"grouped": grouped,
	}})
}

func (h *AdminHandler) GetTournamentsList(w http.ResponseWriter, r *http.Request) {

	game := r.URL.Query().Get("game")

	if len(game) == 0 || game == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to fetch no game id provided", Data: false})
		return
	}

	list, err := h.service.GetTournamentsList(r.Context(), game)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to fetch no game id provided", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: list})
}
