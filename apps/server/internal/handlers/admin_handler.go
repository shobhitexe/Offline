package handlers

import (
	"net/http"
	"server/internal/models"
	"server/internal/service"
	"server/pkg/utils"

	"github.com/go-playground/validator/v10"
)

type AdminHandler struct {
	service   service.AdminService
	utils     utils.Utils
	validator *validator.Validate
}

func NewAdminHandler(service service.AdminService, utils utils.Utils) *AdminHandler {
	return &AdminHandler{service: service, utils: utils, validator: validator.New()}
}

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
