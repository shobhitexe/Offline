package handlers

import (
	"net/http"
	"server/internal/models"
	"server/internal/service"
	"server/pkg/utils"
)

type SportsHandler struct {
	service service.SportsService
	utils   utils.Utils
}

func NewSportsHandler(service service.SportsService, utils utils.Utils) *SportsHandler {
	return &SportsHandler{service: service, utils: utils}
}

func (h *SportsHandler) GetList(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
		return
	}

	data, err := h.service.GetList(id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
}

func (h *SportsHandler) ListEvents(w http.ResponseWriter, r *http.Request) {

	sportsId := r.URL.Query().Get("sportsId")

	if len(sportsId) == 0 || sportsId == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No sports id provided", Data: false})
		return
	}

	competitionId := r.URL.Query().Get("competitionId")

	if len(competitionId) == 0 || competitionId == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No competition id provided", Data: false})
		return
	}

	data, err := h.service.ListEvents(sportsId, competitionId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
}

func (h *SportsHandler) GetEventDetail(w http.ResponseWriter, r *http.Request) {

	eventId := r.URL.Query().Get("eventId")

	if len(eventId) == 0 || eventId == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No sports id provided", Data: false})
		return
	}

	data, err := h.service.GetEventDetail(eventId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
}

func (h *SportsHandler) GetMarketList(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	if len(id) == 0 || id == "" {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch No id provided", Data: false})
		return
	}

	data, err := h.service.GetMarketList(id)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusInternalServerError, models.Response{Message: "Failed to fetch", Data: false})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Data Fetched", Data: data})
}