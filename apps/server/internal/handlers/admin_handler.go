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

func NewAdminHandler(service service.AdminService, utils utils.Utils, validator *validator.Validate) *AdminHandler {
	return &AdminHandler{service: service, utils: utils, validator: validator}
}

func (h *AdminHandler) AdminDetails(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "No ID Provided", Data: "{}"})
		return
	}

	admin, err := h.service.AdminDetails(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Error fetching details", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: admin})

}
