package service

import (
	"context"
	"log"
	"server/internal/models"
)

type AdminReportsService interface {
	GetBalanceSheetReport(ctx context.Context, id string) (*models.BalanceSheet, error)
}

func (s *adminService) GetBalanceSheetReport(ctx context.Context, id string) (*models.BalanceSheet, error) {

	users, err := s.store.GetUsersList(ctx, id)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	userIds := []string{}

	for _, user := range *users {
		userIds = append(userIds, user.ID)
	}

	sheet, err := s.store.GetSettledBetsUsers(ctx, userIds)
	Sheetmap := make(map[string]struct {
		UserType string
		Balance  float64
		UserId   int64
		Name     string
	})

	for _, s := range *sheet {
		data := Sheetmap[s.UserName]

		switch s.Result {
		case "win":
			data.Balance += s.Profit
		case "loss":
			data.Balance -= s.Exposure
		}

		data.UserType = "user"
		data.UserId = s.UserID
		data.Name = s.Name

		Sheetmap[s.UserName] = data
	}

	profitreport := make([]models.BalanceSheetReport, 0)
	lossreport := make([]models.BalanceSheetReport, 0)

	for UserName, data := range Sheetmap {
		switch {
		case data.Balance > 0:
			profitreport = append(profitreport, models.BalanceSheetReport{
				UserType: data.UserType,
				Balance:  data.Balance,
				UserName: UserName,
				UserId:   data.UserId,
				Name:     data.Name,
			})

		case data.Balance <= 0:
			lossreport = append(lossreport, models.BalanceSheetReport{
				UserType: data.UserType,
				Balance:  data.Balance,
				UserName: UserName,
				UserId:   data.UserId,
				Name:     data.Name,
			})
		}
	}

	var total float64

	for _, item := range profitreport {
		total += item.Balance
	}

	profitTotal := models.BalanceSheetReport{
		Balance:  total,
		UserName: "Total",
	}

	profitreport = append(profitreport, profitTotal)

	if err != nil {
		return nil, err
	}

	return &models.BalanceSheet{
		Profit: profitreport,
		Loss:   lossreport,
	}, nil
}
