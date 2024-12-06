package handlers

import (
	"net/http"
	"server/internal/models"
	"server/internal/service"
	"server/pkg/utils"

	"github.com/go-playground/validator/v10"
)

type SportsHandler struct {
	service   service.SportsService
	utils     utils.Utils
	validator *validator.Validate
}

func NewSportsHandler(service service.SportsService, utils utils.Utils, validator *validator.Validate) *SportsHandler {
	return &SportsHandler{service: service, utils: utils, validator: validator}
}

func (h *SportsHandler) GetActiveEvents(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
		return
	}

	event, err := h.service.GetActiveEvents(r.Context(), id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: event})

}

func (h *SportsHandler) GetEventDetail(w http.ResponseWriter, r *http.Request) {

	eventId := r.URL.Query().Get("eventId")

	if len(eventId) == 0 || eventId == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No sports id provided", Data: false})
		return
	}

	data, err := h.service.GetEventDetail(r.Context(), eventId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
}

func (h *SportsHandler) PlaceBet(w http.ResponseWriter, r *http.Request) {

	var payload models.PlaceBet

	if err := h.utils.DecodeAndValidateJSON(r, &payload, h.validator); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Validation Failed", Data: err.Error()})
		return
	}

	if err := h.service.PlaceBet(r.Context(), payload); err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{Message: "Failed to place bet", Data: err.Error()})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Bet Placed", Data: true})

}

// func (h *SportsHandler) GetList(w http.ResponseWriter, r *http.Request) {

// 	id := r.URL.Query().Get("id")

// 	if len(id) == 0 || id == "" {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
// 		return
// 	}

// 	data, err := h.service.GetList(id)

// 	if err != nil {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
// 		return
// 	}

// 	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
// }

// func (h *SportsHandler) ListEvents(w http.ResponseWriter, r *http.Request) {

// 	sportsId := r.URL.Query().Get("sportsId")

// 	if len(sportsId) == 0 || sportsId == "" {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No sports id provided", Data: false})
// 		return
// 	}

// 	competitionId := r.URL.Query().Get("competitionId")

// 	if len(competitionId) == 0 || competitionId == "" {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No competition id provided", Data: false})
// 		return
// 	}

// 	data, err := h.service.ListEvents(sportsId, competitionId)

// 	if err != nil {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
// 		return
// 	}

// 	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
// }

// func (h *SportsHandler) GetMarketList(w http.ResponseWriter, r *http.Request) {

// 	id := r.URL.Query().Get("id")

// 	if len(id) == 0 || id == "" {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
// 		return
// 	}

// 	data, err := h.service.GetMarketList(id)

// 	if err != nil {
// 		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
// 		return
// 	}

// 	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
// }
