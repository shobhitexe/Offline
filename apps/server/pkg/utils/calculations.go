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

	smallestOddsMap := make(map[string]int)
	biggestOddsMap := make(map[string]int)

	for _, bet := range bets {
		if _, exists := smallestOddsMap[bet.RunnerName]; !exists {
			smallestOddsMap[bet.RunnerName] = int(bet.OddsRate)
		}

		if _, exists := biggestOddsMap[bet.RunnerName]; !exists {
			biggestOddsMap[bet.RunnerName] = int(bet.OddsRate)
		}

		if int(bet.OddsRate) < smallestOddsMap[bet.RunnerName] {
			smallestOddsMap[bet.RunnerName] = int(bet.OddsRate)
		}

		if int(bet.OddsRate) > biggestOddsMap[bet.RunnerName] {
			biggestOddsMap[bet.RunnerName] = int(bet.OddsRate)
		}
	}

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

			for diff := -5; diff <= 4; diff++ {
				index := b + diff

				if diff < 0 {
					betMap[bet.RunnerName].Projections[index] += bet.TotalProfit
				} else {
					betMap[bet.RunnerName].Projections[index] -= bet.TotalExposure
				}
			}

		case "yes":
			betMap[bet.RunnerName].TotalExposure += bet.TotalExposure
			betMap[bet.RunnerName].TotalProfit -= bet.TotalProfit

			for diff := -5; diff <= 4; diff++ {
				index := b + diff
				if diff < 0 {
					betMap[bet.RunnerName].Projections[index] -= bet.TotalExposure
				} else {
					betMap[bet.RunnerName].Projections[index] += bet.TotalProfit
				}
			}
		}
	}

	for _, bet := range betMap {
		smallestOdds := smallestOddsMap[bet.RunnerName]
		biggestOdds := biggestOddsMap[bet.RunnerName]
		rangeDiff := biggestOdds - smallestOdds

		if rangeDiff > 0 {
			for i := range bet.Projections {
				if i > smallestOdds+rangeDiff || i < biggestOdds-rangeDiff {
					delete(bet.Projections, i)

					bet.Projections[i+1] = bet.Projections[rangeDiff]
					bet.Projections[i-1] = bet.Projections[rangeDiff]
				}

			}
		}

	}

	for _, bet := range betMap {
		group = append(group, *bet)
	}

	return group
}
