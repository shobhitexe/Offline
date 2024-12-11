package utils

import (
	"server/internal/models"
	"sort"
)

func CalculateActiveBetsOdds(bets *[]models.BetHistoryPerGame, marketType string) map[string]float64 {

	runnerSet := make(map[string]struct{})
	runners := []string{}

	for _, bet := range *bets {

		if bet.MarketName != marketType {
			continue
		}
		if _, exists := runnerSet[bet.Selection]; !exists {
			runners = append(runners, bet.Selection)
			runnerSet[bet.Selection] = struct{}{}
		}
	}

	sort.Strings(runners)

	results := make(map[string]float64)
	for _, runner := range runners {
		results[runner] = 0
	}

	for _, bet := range *bets {

		if bet.MarketName != marketType {
			continue
		}

		if bet.BetType == "back" {
			results[bet.Selection] += bet.PNL
			for _, runner := range runners {
				if runner != bet.Selection {
					results[runner] -= bet.Stake
				}
			}
		} else if bet.BetType == "lay" {
			results[bet.Selection] -= bet.Stake
			for _, runner := range runners {
				if runner != bet.Selection {
					results[runner] += bet.PNL
				}
			}
		}
	}

	return results
}
