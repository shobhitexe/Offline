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
