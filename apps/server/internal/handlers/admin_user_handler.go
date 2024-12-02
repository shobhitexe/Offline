package handlers

import (
	"log"
	"net/http"
	"server/internal/models"
	"strconv"
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

func (h *AdminHandler) EditUser(w http.ResponseWriter, r *http.Request) {

	log.Println(r.URL.Query())

	var payload models.EditUser

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.EditUser(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "User edited", Data: true})
}

func (h *AdminHandler) GetUsersList(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")
	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no ID provided",
			Data:    "[]",
		})
		return
	}

	_id, err := strconv.Atoi(id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, error converting to int",
			Data:    "[]",
		})
		return
	}

	list, err := h.service.UsersList(r.Context(), _id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Fetched list", Data: list})
}
