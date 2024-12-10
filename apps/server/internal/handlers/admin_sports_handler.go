package handlers

import (
	"net/http"
	"server/internal/models"
)

func (h *AdminHandler) GetActiveBetsListByMarketID(w http.ResponseWriter, r *http.Request) {

	params := r.URL.Query()

	eventId := params.Get("eventId")

	if len(eventId) == 0 {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no Event ID provided",
			Data:    "[]",
		})
		return
	}

	marketId := params.Get("marketId")

	if len(marketId) == 0 {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed, no Market ID provided",
			Data:    "[]",
		})
		return
	}

	data, err := h.service.GetActiveBetsListByMarketID(r.Context(), eventId, marketId)

	if err != nil {
		h.utils.WriteJSON(w, http.StatusBadRequest, models.Response{
			Message: "Failed",
			Data:    "[]",
		})
		return
	}

	h.utils.WriteJSON(w, http.StatusOK, models.Response{Message: "Details fetched", Data: data})

}
