package service

import (
	"context"
	"server/internal/models"
	"sync"
)

type AdminReportsService interface {
	GetBalanceSheetReport(ctx context.Context, id string) (*models.BalanceSheet, error)
}

func (s *adminService) GetBalanceSheetReport(ctx context.Context, id string) (*models.BalanceSheet, error) {

	var wg sync.WaitGroup
	var users *[]models.List
	var agents *[]models.List
	var cashParent, cashChild float64
	var admin *models.Admin
	var usersErr, agentsErr, cashParentErr, cashChildErr, adminErr error

	wg.Add(1)
	go func() {
		defer wg.Done()
		users, usersErr = s.store.GetUsersList(ctx, id)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		agents, agentsErr = s.store.GetAgentsList(ctx, id)

	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		cashParent, cashParentErr = s.store.CalculateCashParent(ctx, id)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		cashChild, cashChildErr = s.store.CalculateCashChild(ctx, id)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		admin, adminErr = s.store.GetAdminWalllets(ctx, id)
	}()

	wg.Wait()

	switch {
	case usersErr != nil:
		return nil, usersErr
	case agentsErr != nil:
		return nil, agentsErr
	case cashParentErr != nil:
		return nil, cashParentErr
	case cashChildErr != nil:
		return nil, cashChildErr
	case adminErr != nil:
		return nil, adminErr

	}

	profitreport := make([]models.BalanceSheetReport, 0)
	lossreport := make([]models.BalanceSheetReport, 0)

	for _, data := range *users {
		switch {
		case data.Settlement > 0:
			profitreport = append(profitreport, models.BalanceSheetReport{
				UserType: "user",
				Balance:  data.Settlement,
				UserName: data.Username + " [" + data.Name + "]",
				UserId:   data.ID,
			})
			break

		case data.Settlement <= 0:
			lossreport = append(lossreport, models.BalanceSheetReport{
				UserType: "user",
				Balance:  data.Settlement,
				UserName: data.Username + " [" + data.Name + "]",
				UserId:   data.ID,
			})
			break
		}
	}

	for _, data := range *agents {
		switch {
		case data.Settlement > 0:
			profitreport = append(profitreport, models.BalanceSheetReport{
				UserType: "agent",
				Balance:  data.Settlement,
				UserName: data.Username + " [" + data.Name + "]",
				UserId:   data.ID,
			})

		case data.Settlement <= 0:
			lossreport = append(lossreport, models.BalanceSheetReport{
				UserType: "agent",
				Balance:  data.Settlement,
				UserName: data.Username + " [" + data.Name + "]",
				UserId:   data.ID,
			})
		}
	}
	extra := []models.BalanceSheetReport{
		{
			UserType: "cash",
			Balance:  cashChild,
		},
		{
			UserType: "session",
			Balance:  0,
		},
		{
			UserType: "settlement",
			Balance:  admin.Settlement,
		},
		{
			UserType: "cashparent",
			Balance:  cashParent,
		},
		{
			UserType: "pnl",
			Balance:  0,
		},
		{
			UserType: "commission",
			Balance:  0,
		},
	}

	switch {
	case admin.Settlement <= 0:
		lossreport = append(lossreport, extra...)

	case admin.Settlement > 0:
		profitreport = append(profitreport, extra...)
	}

	return &models.BalanceSheet{
		Profit: profitreport,
		Loss:   lossreport,
	}, nil
}
