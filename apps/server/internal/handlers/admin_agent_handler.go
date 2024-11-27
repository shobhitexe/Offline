package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) HandleLogin(w http.ResponseWriter, r *http.Request) {

	var payload models.AdminLoginRequest

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	data, err := h.service.AdminLogin(payload, r.Context())

	if err != nil {
		h.utils.WriteJSON(w, http.StatusUnauthorized, models.Response{Data: "Login Failed", Message: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Data: data, Message: "Logged in successfully"})
}

func (h *AdminHandler) GetAgentList(w http.ResponseWriter, r *http.Request) {

	list, err := h.service.AgentsList(r.Context())

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Fetched list", Data: list})

}

func (h *AdminHandler) CreateAgent(w http.ResponseWriter, r *http.Request) {

	var payload models.CreateAgent

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return
	}

	if err := h.service.CreateAgent(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: err.Error(), Data: false})
		return

	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "created agent", Data: true})

}
