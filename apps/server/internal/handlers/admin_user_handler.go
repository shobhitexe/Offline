package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) CreateUser(w http.ResponseWriter, r *http.Request) {

	var payload models.CreateUser

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.CreateUser(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "User created", Data: true})
}

func (h *AdminHandler) GetUsersList(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.UsersList(r.Context())

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Fetched list", Data: list})
}
