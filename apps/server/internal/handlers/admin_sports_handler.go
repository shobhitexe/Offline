package handlers

import (
	"encoding/json"
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) GetActiveBetsListByMarketID(w http.ResponseWriter, r *http.Request) {

	params := r.URL.Query()

	eventId := params.Get("eventId")

	if len(eventId) == 0 || eventId == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no Event ID provided",
			Data:    []string{},
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

func (h *AdminHandler) GetRunners(w http.ResponseWriter, r *http.Request) {

	eventId := r.URL.Query().Get("eventId")

	if len(eventId) == 0 || eventId == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to fetch no event id provided", Data: []string{}})
		return
	}

	list, err := h.service.GetRunnersofEvent(r.Context(), eventId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to fetch", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: list})
}

func (h *AdminHandler) SetRunnerResult(w http.ResponseWriter, r *http.Request) {

	var payload models.SetRunnerResultRequest

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.SetRunnerResult(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: true})
}

func (h *AdminHandler) GetRunnerHistory(w http.ResponseWriter, r *http.Request) {

	history, err := h.service.GetRunnerHistory(r.Context())

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: []any{}})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: history})

}

func (h *AdminHandler) GetOpenMarket(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
		return
	}

	event, err := h.service.GetOpenMarket(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: event})

}

func (h *AdminHandler) ChangeOpenMarketStatus(w http.ResponseWriter, r *http.Request) {

	var payload struct {
		EventID string `json:"eventId"`
	}

	defer r.Body.Close()

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to decode id", Data: false})
		return
	}

	if len(payload.EventID) == 0 || payload.EventID == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to change No id provided", Data: false})
		return
	}

	if err := h.service.ChangeOpenMarketStatus(r.Context(), payload.EventID); err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Status Changed", Data: true})
}

func (h *AdminHandler) ChangeTournamentStatus(w http.ResponseWriter, r *http.Request) {

	var payload models.ChangeTournamentStatus

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.ChangeTournamentStatus(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Status Changed", Data: true})

}

func (h *AdminHandler) GroupActiveEventsForFancyBets(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
		return
	}

	b, err := h.service.GroupActiveEventsForFancyBets(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Fetched", Data: b})
}
