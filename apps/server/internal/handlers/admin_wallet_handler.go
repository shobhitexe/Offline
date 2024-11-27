package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) WalletBalance(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No ID Provided", Data: "NaN"})
		return
	}

	balance, err := h.service.GetBalance(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Error fetching balance", Data: "NaN"})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Balance fetched", Data: balance})

}
