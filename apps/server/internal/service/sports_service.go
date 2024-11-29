package service

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"server/internal/store"
)

type SportsService interface {
	GetList(id string) (interface{}, error)
	ListEvents(sportsId, competitionId string) (interface{}, error)
	GetEventDetail(eventId string) (interface{}, error)
	GetMarketList(id string) (interface{}, error)
}

type sportsService struct {
	store  *store.SportsStore
	client *http.Client
}

func NewSportsService(store store.SportsStore, client *http.Client) SportsService {
	return &sportsService{
		store:  &store,
		client: client,
	}
}

func (s *sportsService) GetList(id string) (interface{}, error) {

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/getList/" + id)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	var jsonData interface{}
	err = json.Unmarshal(body, &jsonData)

	return jsonData, nil
}

func (s *sportsService) ListEvents(sportsId, competitionId string) (interface{}, error) {

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/listEvents/" + sportsId + "/" + competitionId)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	var jsonData interface{}
	err = json.Unmarshal(body, &jsonData)

	return jsonData, nil

}

func (s *sportsService) GetEventDetail(eventId string) (interface{}, error) {
	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/getEventDetail/" + eventId)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	var jsonData interface{}
	err = json.Unmarshal(body, &jsonData)

	return jsonData, nil
}

func (s *sportsService) GetMarketList(id string) (interface{}, error) {

	res, err := s.client.Get("https://leisurebuzz.in/api/v2/competition/getMarketList/" + id)

	if err != nil {
		log.Println("Error fetching data", err)
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		log.Println("Error reading response body:", err)
		return nil, err
	}

	var jsonData interface{}
	err = json.Unmarshal(body, &jsonData)

	return jsonData, nil
}
