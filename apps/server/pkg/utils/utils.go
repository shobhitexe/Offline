package utils

import (
	"encoding/json"
	"fmt"
	"server/internal/models"
	"time"

	"net/http"

	"github.com/go-playground/validator/v10"
)

type Utils interface {
	WriteJSON(w http.ResponseWriter, statusCode int, v models.Response)
	DecodeJSON(r *http.Request, v interface{}) error
	Validate(v interface{}) error
	DecodeAndValidateJSON(r *http.Request, v interface{}, validator *validator.Validate) error
	FormatTime(timestamp string) string
}

type utils struct {
	Validator *validator.Validate
}

func NewUtils() Utils {
	return &utils{Validator: validator.New()}
}

func (u *utils) DecodeAndValidateJSON(r *http.Request, v interface{}, validator *validator.Validate) error {

	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		return err
	}

	if err := validator.Struct(v); err != nil {
		return err
	}

	return nil
}

func (u *utils) Validate(v interface{}) error {
	return u.Validator.Struct(v)
}

func (u *utils) DecodeJSON(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func (u *utils) WriteJSON(w http.ResponseWriter, statusCode int, v models.Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(v)
}

func (u *utils) FormatTime(timestamp string) string {

	t, err := time.Parse(time.RFC3339Nano, timestamp)
	if err != nil {
		fmt.Println("Error parsing time:", err)
		return ""
	}

	istLocation, err := time.LoadLocation("Asia/Kolkata")
	if err != nil {
		fmt.Println("Error loading location:", err)
		return ""
	}

	istTime := t.In(istLocation)

	return istTime.Format("02/01/2006, 3:04:05 PM")
}
