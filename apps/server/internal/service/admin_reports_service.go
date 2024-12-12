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
		return nil, err
	}

	agents, err := s.store.GetAgentsList(ctx, id, 8)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	// sheet, err := s.store.GetSettledBetsUsers(ctx, userIds)

	// if err != nil {
	// 	log.Println("Error fetching settled bets:", err)
	// 	return nil, err
	// }

	// if sheet == nil {
	// 	log.Println("No settled bets found")
	// 	return nil, fmt.Errorf("no settled bets found for users")
	// }

	// Sheetmap := make(map[string]struct {
	// 	UserType string
	// 	Balance  float64
	// 	UserId   int64
	// 	Name     string
	// })

	// for _, s := range *sheet {
	// 	data := Sheetmap[s.UserName]

	// 	data.UserType = "user"
	// 	data.UserId = s.UserID
	// 	data.Name = s.Name
	// 	data.Balance = s.Settlement

	// 	Sheetmap[s.UserName] = data
	// }

	admin, err := s.store.GetAdminWalllets(ctx, id)

	if err != nil {
		return nil, err
	}

	profitreport := make([]models.BalanceSheetReport, 0)
	lossreport := make([]models.BalanceSheetReport, 0)

	for _, data := range *users {
		switch {
		case data.Settlement > 0:
			profitreport = append(profitreport, models.BalanceSheetReport{
				UserType: "user",
				Balance:  data.Settlement,
				UserName: data.Username + "[" + data.Name + "]",
				UserId:   data.ID,
			})

		case data.Settlement <= 0:
			lossreport = append(lossreport, models.BalanceSheetReport{
				UserType: "user",
				Balance:  data.Settlement,
				UserName: data.Username + "[" + data.Name + "]",
				UserId:   data.ID,
			})
		}
	}

	for _, data := range *agents {
		switch {
		case data.Settlement > 0:
			profitreport = append(profitreport, models.BalanceSheetReport{
				UserType: "agent",
				Balance:  data.Settlement,
				UserName: data.Username + "[" + data.Name + "]",
				UserId:   data.ID,
			})

		case data.Settlement <= 0:
			lossreport = append(lossreport, models.BalanceSheetReport{
				UserType: "agent",
				Balance:  data.Settlement,
				UserName: data.Username + "[" + data.Name + "]",
				UserId:   data.ID,
			})
		}
	}
	extra := models.BalanceSheetReport{
		UserType: "cash",
		Balance:  admin.Settlement,
		UserName: "",
		UserId:   "",
	}

	switch {
	case admin.Settlement <= 0:
		lossreport = append(lossreport, extra)

	case admin.Settlement > 0:
		profitreport = append(profitreport, extra)
	}

	// var total float64

	// for _, item := range profitreport {
	// 	total += item.Balance
	// }

	// profitTotal := models.BalanceSheetReport{
	// 	Balance:  total,
	// 	UserName: "Total",
	// }

	// profitreport = append(profitreport, profitTotal)

	return &models.BalanceSheet{
		Profit: profitreport,
		Loss:   lossreport,
	}, nil
}
