package handlers

import (
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
