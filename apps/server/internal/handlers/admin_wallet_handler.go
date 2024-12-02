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

func (h *AdminHandler) TransferCreditUser(w http.ResponseWriter, r *http.Request) {

	var payload models.TransferCredit

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	if err := h.service.TransferCreditToUser(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Error transferring credit: " + err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Transferred successfully", Data: true})
}

func (h *AdminHandler) DebitUser(w http.ResponseWriter, r *http.Request) {

	var payload models.TransferCredit

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	if err := h.service.DebitFromUser(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Error transferring debit: " + err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Transferred successfully", Data: true})

}
