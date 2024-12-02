package handlers

import (
	"encoding/json"
	"net/http"
	"server/internal/models"
	"strconv"
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

	query := r.URL.Query()

	id := query.Get("id")
	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no ID provided",
			Data:    "[]",
		})
		return
	}

	childLevelStr := query.Get("childLevel")
	if len(childLevelStr) == 0 {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no childLevel provided",
			Data:    "[]",
		})
		return
	}

	childLevel, err := strconv.Atoi(childLevelStr)
	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, childLevel must be an integer",
			Data:    err.Error(),
		})
		return
	}

	if childLevel < 1 || childLevel > 8 {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, childLevel must be between 1 and 8",
			Data:    "[]",
		})
		return
	}

	list, err := h.service.AgentsList(r.Context(), id, childLevel)

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

func (h *AdminHandler) IsAdminBlocked(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No ID Provided", Data: "{}"})
		return
	}

	b, err := h.service.IsAdminBlocked(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to check status", Data: "{}"})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "blocked status fetched", Data: b})

}

func (h *AdminHandler) ChangeAdminBlockStatus(w http.ResponseWriter, r *http.Request) {

	var req struct {
		ID  string `json:"id"`
		Val bool   `json:"val"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Invalid request body",
			Data:    err.Error(),
		})
		return
	}

	if err := h.service.ChangeAdminBlockStatus(r.Context(), req.ID, req.Val); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "blocked status changed", Data: "Status changed"})
}

func (h *AdminHandler) IsUserBlocked(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No ID Provided", Data: "{}"})
		return
	}

	b, err := h.service.IsUserBlocked(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to check status", Data: "{}"})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "blocked status fetched", Data: b})

}

func (h *AdminHandler) ChangeUserBlockStatus(w http.ResponseWriter, r *http.Request) {

	var req struct {
		ID  string `json:"id"`
		Val bool   `json:"val"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Invalid request body",
			Data:    err.Error(),
		})
		return
	}

	if err := h.service.ChangeUserBlockStatus(r.Context(), req.ID, req.Val); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "blocked status changed", Data: "Status changed"})
}
