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
