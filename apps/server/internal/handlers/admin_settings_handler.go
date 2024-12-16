package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) GetSportsSettings(w http.ResponseWriter, r *http.Request) {

	settings, err := h.service.GetSportsSettings(r.Context())
	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{
			Message: "Failed to fetch",
			Data:    err.Error(),
		})
		return
	}
	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: settings})
}

func (h *AdminHandler) UpdateSportsSettings(w http.ResponseWriter, r *http.Request) {

	var payload models.SportsSettings

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.UpdateSportsSettings(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: true})
}

func (h *AdminHandler) GetTournamentSettings(w http.ResponseWriter, r *http.Request) {

	game := r.URL.Query().Get("game")

	if len(game) == 0 && game == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "No game id provided", Data: []string{}})
		return
	}

	settings, err := h.service.GetTournamentSettings(r.Context(), game)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: settings})
}

func (h *AdminHandler) GetSingleTournamentSettings(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 && id == "" {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "No id provided", Data: []string{}})
		return
	}

	settings, err := h.service.GetSingleTournamentSettings(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: settings})
}

func (h *AdminHandler) UpdateTournamentSettings(w http.ResponseWriter, r *http.Request) {

	var payload models.TournamentSettings

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.UpdateTournamentSettings(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details edited", Data: true})
}
