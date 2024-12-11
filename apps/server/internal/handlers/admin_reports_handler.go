package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) GetBalanceSheetReport(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No Id provided", Data: false})
		return
	}

	s, err := h.service.GetBalanceSheetReport(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch balance sheet", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: s})

}
