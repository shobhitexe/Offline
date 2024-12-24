package handlers

import (
	"net/http"
	"server/internal/models"
	"server/internal/service"
	"server/pkg/utils"

	"github.com/go-playground/validator/v10"
)

type UserHandler struct {
	utils     utils.Utils
	service   service.UserService
	validator *validator.Validate
}

func NewUserHandler(utils utils.Utils, service service.UserService, validator *validator.Validate) *UserHandler {
	return &UserHandler{utils: utils, service: service, validator: validator}
}

func (h *UserHandler) UserDetails(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No ID Provided", Data: "{}"})
		return
	}

	user, err := h.service.UserDetails(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Error fetching details", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: user})

}

func (h *UserHandler) WalletBalance(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No ID Provided", Data: false})
		return
	}

	balance, err := h.service.GetBalance(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Error fetching balance", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Balance fetched", Data: balance})

}

func (h *UserHandler) SignIn(w http.ResponseWriter, r *http.Request) {

	var payload models.SignInRequest

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	user, err := h.service.SignIn(r.Context(), payload)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to sign in", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Logged in", Data: user})

}

func (h *UserHandler) GetStatement(w http.ResponseWriter, r *http.Request) {

	var statement models.StatementRequest

	statement.ID = r.URL.Query().Get("id")
	statement.FromDate = r.URL.Query().Get("from")
	statement.ToDate = r.URL.Query().Get("to")
	statement.GameType = r.URL.Query().Get("gameType")
	statement.MarketType = r.URL.Query().Get("marketType")

	if err := h.utils.Validate(&statement); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	s, err := h.service.GetStatement(r.Context(), statement)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: s})
}

func (h *UserHandler) GetBetStatement(w http.ResponseWriter, r *http.Request) {

	var statement models.StatementRequest

	statement.ID = r.URL.Query().Get("id")
	statement.FromDate = r.URL.Query().Get("from")
	statement.ToDate = r.URL.Query().Get("to")
	statement.GameType = r.URL.Query().Get("gameType")
	statement.MarketType = r.URL.Query().Get("marketType")

	if err := h.utils.Validate(&statement); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	s, err := h.service.GetBetStatement(r.Context(), statement)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data fetched", Data: s})
}
