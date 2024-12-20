package utils

import (
	"server/internal/models"
)

func CalculateActiveBetsOdds(bets *[]models.BetHistoryPerGame, marketType string, runners []models.SavedRunner) map[string]float64 {
	results := make(map[string]float64)

	for _, bet := range *bets {
		if bet.MarketName != marketType {
			continue
		}

		if bet.BetType == "back" {
			results[bet.Selection] += bet.PNL
			for _, runner := range runners {
				if runner.RunnerName != bet.Selection {
					results[runner.RunnerName] -= bet.Stake
				}
			}
		} else if bet.BetType == "lay" {
			results[bet.Selection] -= bet.Stake
			for _, runner := range runners {
				if runner.RunnerName != bet.Selection {
					results[runner.RunnerName] += bet.PNL
				}
			}
		}
	}

	return results
}

func CalculateActiveFancyBetsProjection(bets []models.FancyBets) []models.FancyBets {
	group := make([]models.FancyBets, 0)
	betMap := make(map[string]*models.FancyBets)

	for _, bet := range bets {
		if _, exists := betMap[bet.RunnerName]; !exists {
			betMap[bet.RunnerName] = &models.FancyBets{
				RunnerName: bet.RunnerName,
				OddsRate:   bet.OddsRate,
			}
			betMap[bet.RunnerName].Projections = make(map[int]float64)
		}

		b := int(bet.OddsRate)

		switch bet.BetType {
		case "no":
			betMap[bet.RunnerName].TotalExposure -= bet.TotalExposure
			betMap[bet.RunnerName].TotalProfit += bet.TotalExposure

			// Adjust below odds rate for profit
			for index := b - 5; index < b; index++ {
				betMap[bet.RunnerName].Projections[index] += bet.TotalProfit
			}

			// Adjust at odds rate for exposure
			betMap[bet.RunnerName].Projections[b] -= bet.TotalExposure

			// Adjust above odds rate for exposure
			for index := b + 1; index <= b+4; index++ {
				if index < b+5 { // Ensure it doesn’t affect beyond range
					betMap[bet.RunnerName].Projections[index] -= bet.TotalExposure
				}
			}

		case "yes":
			betMap[bet.RunnerName].TotalExposure += bet.TotalExposure
			betMap[bet.RunnerName].TotalProfit -= bet.TotalProfit

			// Adjust below odds rate for exposure
			for index := b - 5; index < b; index++ {
				if index >= b-5 { // Ensure it doesn’t affect below range
					betMap[bet.RunnerName].Projections[index] -= bet.TotalExposure
				}
			}

			// Adjust at odds rate for profit
			betMap[bet.RunnerName].Projections[b] += bet.TotalProfit

			// Adjust above odds rate for profit
			for index := b + 1; index <= b+4; index++ {
				betMap[bet.RunnerName].Projections[index] += bet.TotalProfit
			}
		}
	}

	// Convert map to slice
	for _, bet := range betMap {
		group = append(group, *bet)
	}

	return group
}
