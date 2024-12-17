package store

import (
	"context"
	"fmt"
	"log"
	"server/internal/models"
	"strconv"

	"github.com/jackc/pgx/v5"
)

type AdminSportsStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	GetActiveBetsListByMarketID(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error)
	BetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error)
	FancyBetsPerEventId(ctx context.Context, eventId string) ([]models.FancyBets, error)
	SaveRunnerResultHistory(ctx context.Context, payload models.SetRunnerResultRequest) error
	GetRunnerResults(ctx context.Context, eventId string) (map[string]int64, error)
	SaveActiveEvents(ctx context.Context, payload models.ListEvents, id string, MatchOdds models.MarketInfo) error
	GetActiveSession(ctx context.Context, eventId string) ([]models.ActiveSession, error)
	GetActiveFancyBets(ctx context.Context, eventId string) ([]models.ActiveBet, error)
	BetResultWin(ctx context.Context, tx pgx.Tx, profit, exposure float64, id string) error
	BetResultLose(ctx context.Context, tx pgx.Tx, exposure float64, userID string) error
	ChangeActiveBetStatus(ctx context.Context, tx pgx.Tx, id, result string) error
	FindMarketOddsBetsByEventID(ctx context.Context, eventID, runnerID, marketId string) (*[]models.ActiveBet, error)
	InitTournamentSettings(ctx context.Context, tournamentID, sportsId, tournamentName string) error
	GetOpenMarket(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	ChangeOpenMarketStatus(ctx context.Context, eventId string) (int, error)
	GetRunnerHistory(ctx context.Context) ([]models.RunnerHistory, error)
}

func (s *adminStore) GetOpenMarket(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var events []models.ActiveEvents

	query := `
	SELECT 
		match_name, 
		event_id,
		competition_id,
		category,
		active,
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		active_events
	WHERE 
		sports_id = $1 AND is_declared = false
	ORDER BY opening_time`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {

		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.ActiveEvents
		if err := rows.Scan(
			&event.EventName,
			&event.EventId,
			&event.CompetitionId,
			&event.Category,
			&event.Active,
			&event.EventTime,
		); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return &events, nil
}

func (s *adminStore) ChangeOpenMarketStatus(ctx context.Context, eventId string) (int, error) {

	var sportsid int

	query := `UPDATE active_events SET active = NOT active WHERE event_id = $1 RETURNING sports_id`

	if err := s.db.QueryRow(ctx, query, eventId).Scan(&sportsid); err != nil {
		return 0, err
	}

	return sportsid, nil
}

func (s *adminStore) GetRunnerHistory(ctx context.Context) ([]models.RunnerHistory, error) {

	var history []models.RunnerHistory

	query := `SELECT
	 event_name, runner_name, run, 
	 TO_CHAR(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS created_at 
	 FROM runner_results
	 ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {

		var item models.RunnerHistory

		if err := rows.Scan(
			&item.MatchName,
			&item.RunnerName,
			&item.Result,
			&item.SettlementTime,
		); err != nil {
			return nil, err
		}

		history = append(history, item)

	}

	return history, nil
}

func (s *adminStore) GetActiveBetsListByMarketID(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error) {

	var history []models.BetHistoryPerGame

	query := `SELECT 
	runner_name, odds_rate, exposure, profit, bet_type, market_type, runner_id, event_id
	FROM sport_bets WHERE event_id = $1 AND settled = false
	ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {

		return nil, err
	}

	for rows.Next() {
		var row models.BetHistoryPerGame
		if err := rows.Scan(&row.Selection, &row.Odds, &row.Stake, &row.PNL, &row.BetType, &row.MarketName, &row.RunnerId, &row.EventId); err != nil {

			log.Println(err)

			return nil, err
		}

		history = append(history, row)
	}

	return &history, nil
}

func (s *adminStore) BetHistoryPerGame(ctx context.Context, eventId string) (*[]models.BetHistoryPerGame, error) {

	var history []models.BetHistoryPerGame

	query := `SELECT 
	runner_name, odds_rate, exposure, profit, bet_type, market_type, runner_id 
	FROM sport_bets WHERE event_id = $1 AND settled = false
	ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var row models.BetHistoryPerGame
		rows.Scan(&row.Selection, &row.Odds, &row.Stake, &row.PNL, &row.BetType, &row.MarketName, &row.RunnerId)

		history = append(history, row)
	}

	return &history, nil
}

func (s *adminStore) FancyBetsPerEventId(ctx context.Context, eventId string) ([]models.FancyBets, error) {

	var bets []models.FancyBets

	query := `SELECT runner_name, odds_rate, bet_type, SUM(exposure) AS total_exposure, SUM(profit) AS total_profit
			  FROM sport_bets 
			  WHERE settled = false 
              AND market_type = 'Fancy' 
              AND event_id = $1
              GROUP BY runner_name, odds_rate, bet_type`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var bet models.FancyBets

		if err := rows.Scan(
			&bet.RunnerName,
			&bet.OddsRate,
			&bet.BetType,
			&bet.TotalExposure,
			&bet.TotalProfit,
		); err != nil {
			return nil, err
		}

		bets = append(bets, bet)

	}

	return bets, nil
}

func (s *adminStore) GetActiveFancyBets(ctx context.Context, eventId string) ([]models.ActiveBet, error) {

	var bets []models.ActiveBet

	query := `SELECT 
	id, match_id, event_id, user_id, odds_price, odds_rate, bet_type, market_name, market_id, runner_name, runner_id, profit, exposure 
	from sport_bets
	WHERE settled = false AND market_type = 'Fancy' AND event_id = $1`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {

		var item models.ActiveBet

		if err := rows.Scan(
			&item.ID,
			&item.MatchId,
			&item.EventId,
			&item.UserId,
			&item.OddsPrice,
			&item.OddsRate,
			&item.BetType,
			&item.MarketName,
			&item.MarketId,
			&item.RunnerName,
			&item.RunnerID,
			&item.Profit,
			&item.Exposure,
		); err != nil {
			return nil, err
		}

		bets = append(bets, item)
	}

	return bets, nil
}

func (s *adminStore) GetRunnerResults(ctx context.Context, eventId string) (map[string]int64, error) {
	result := make(map[string]int64)

	query := `SELECT runner_id, run FROM runner_results WHERE is_declared = false AND event_id = $1`

	rows, err := s.db.Query(ctx, query, eventId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var item models.GetRunnerResults

		if err := rows.Scan(&item.RunnerId, &item.Run); err != nil {
			return nil, err
		}

		result[item.RunnerId] = item.Run
	}

	return result, nil
}

func (s *adminStore) SaveRunnerResultHistory(ctx context.Context, payload models.SetRunnerResultRequest) error {

	query := `INSERT INTO 
	runner_results (event_id, event_name, runner_name, runner_id, run) 
	VALUES ($1, $2, $3, $4, $5)`

	_, err := s.db.Exec(ctx, query, payload.EventId, payload.EventName, payload.RunnerName, payload.RunnerId, payload.Run)

	if err != nil {
		return err
	}

	return nil
}

func (s *adminStore) SaveActiveEvents(ctx context.Context, payload models.ListEvents, id string, MatchOdds models.MarketInfo) error {

	competitionId, err := strconv.Atoi(payload.Competition.ID)

	if err != nil {
		return err
	}

	query := `INSERT INTO active_events 
	(sports_id, match_name, event_id, competition_id, runners, match_odds, category, opening_time) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err = s.db.Exec(ctx, query, id,
		payload.Event.Name,
		payload.Event.ID,
		competitionId,
		payload.Runners,
		MatchOdds,
		payload.Competition.Name,
		payload.Event.OpenDate,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *adminStore) GetActiveSession(ctx context.Context, eventId string) ([]models.ActiveSession, error) {
	var session []models.ActiveSession

	query := `SELECT runner_id, 
       MAX(market_name) AS market_name, 
       MAX(runner_name) AS runner_name,
	   MAX(event_id) AS event_id
       FROM sport_bets
	   WHERE settled = false
	   AND event_id = $1
       GROUP BY runner_id`

	rows, err := s.db.Query(ctx, query, eventId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var item models.ActiveSession
		if err := rows.Scan(&item.RunnerId, &item.MarketName, &item.RunnerName, &item.EventId); err != nil {
			return nil, err
		}
		session = append(session, item)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return session, nil
}

func (s *adminStore) BetResultWin(ctx context.Context, tx pgx.Tx, profit, exposure float64, userID string) error {
	query := `UPDATE users SET settlement = settlement + $1, exposure = exposure - $2 WHERE id = $3`
	if _, err := s.db.Exec(ctx, query, profit, exposure, userID); err != nil {
		return fmt.Errorf("failed to update settlement and exposure for user %s: %w", userID, err)
	}

	return nil
}

func (s *adminStore) BetResultLose(ctx context.Context, tx pgx.Tx, exposure float64, userID string) error {
	query := `UPDATE users SET exposure = exposure - $1, settlement = settlement - $1 WHERE id = $2`
	if _, err := s.db.Exec(ctx, query, exposure, userID); err != nil {
		return fmt.Errorf("failed to update balance and exposure for user %s: %w", userID, err)
	}
	return nil
}

func (s *adminStore) ChangeActiveBetStatus(ctx context.Context, tx pgx.Tx, id, result string) error {

	query := `UPDATE sport_bets SET settled = true, result = $1 WHERE id = $2`

	if _, err := tx.Exec(ctx, query, result, id); err != nil {
		return fmt.Errorf("failed to status for bet %s: %w", id, err)

	}

	return nil
}

func (s *adminStore) FindMarketOddsBetsByEventID(ctx context.Context, eventID, runnerID, marketId string) (*[]models.ActiveBet, error) {

	var allbets []models.ActiveBet

	query := `SELECT 
	id, match_id, event_id, user_id, odds_price, odds_rate, bet_type, market_name, market_id, runner_name, runner_id, profit, exposure 
	from sport_bets
	WHERE event_id = $1 AND runner_id = $2 AND market_id = $3 AND settled = false AND market_type = 'Match Odds'`

	bets, err := s.db.Query(ctx, query, eventID, runnerID, marketId)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	for bets.Next() {

		var bet models.ActiveBet

		if err := bets.Scan(
			&bet.ID,
			&bet.MatchId,
			&bet.EventId,
			&bet.UserId,
			&bet.OddsPrice,
			&bet.OddsRate,
			&bet.BetType,
			&bet.MarketName,
			&bet.MarketId,
			&bet.RunnerName,
			&bet.RunnerID,
			&bet.Profit,
			&bet.Exposure,
		); err != nil {
			log.Println(err)

			return nil, err
		}

		allbets = append(allbets, bet)

	}

	return &allbets, nil
}

func (s *adminStore) InitTournamentSettings(ctx context.Context, tournamentID, sportsId, tournamentName string) error {
	checkQuery := `
		SELECT 1 FROM tournament_settings WHERE id = $1
	`

	var exists int
	err := s.db.QueryRow(ctx, checkQuery, tournamentID).Scan(&exists)
	if err != nil && err != pgx.ErrNoRows {
		log.Println(err)
		return fmt.Errorf("failed to check if tournament settings exist: %w", err)
	}

	if err == pgx.ErrNoRows {
		log.Println("Tournament settings not found, proceeding with insert.")
	} else {
		log.Println("Tournament settings already exist, skipping insert.")
		return nil
	}

	if exists > 0 {
		log.Println("Tournament settings already exist, skipping insert.")
		return nil
	}

	insertQuery := `INSERT INTO tournament_settings (
    id, tournament_name, sports_id,
    pre_mo_stakes_min, pre_mo_stakes_max, 
    post_mo_stakes_min, post_mo_stakes_max, 
    pre_bm_stakes_min, pre_bm_stakes_max, 
    post_bm_stakes_min, post_bm_stakes_max, 
    pre_fancy_stakes_min, pre_fancy_stakes_max,
    post_fancy_stakes_min, post_fancy_stakes_max,  
    toss_stakes_min, toss_stakes_max, 
    bet_delay_mo, bet_delay_bm, bet_delay_to, bet_delay_fa, 
    max_profit_mo, max_profit_bm, max_profit_to, max_profit_fa,
	max_odds
) 
VALUES (
    $1, $2, $3,
    100, 100000,
    100, 100000, 
    100, 100000, 
    100, 100000, 
    100, 100000, 
    100, 100000, 
	100, 100000, 
    1, 1, 1, 1,
    100000, 100000, 100000, 100000,
	10 )`

	_, err = s.db.Exec(ctx, insertQuery, tournamentID, tournamentName, sportsId)
	if err != nil {
		return fmt.Errorf("failed to insert default tournament settings: %w", err)
	}

	return nil
}
