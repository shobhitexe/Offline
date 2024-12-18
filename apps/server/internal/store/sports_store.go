package store

import (
	"context"
	"fmt"
	"log"
	"server/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SportsStore interface {
	BeginTx(ctx context.Context) (pgx.Tx, error)
	GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	PlaceBet(ctx context.Context, tx pgx.Tx, payload models.PlaceBet, id string, profit, exposure float64) error
	FindMatchIDByEventID(ctx context.Context, tx pgx.Tx, id string) (string, error)
	TransferBetValueToExposure(ctx context.Context, tx pgx.Tx, id string, amount float64) error
	BetHistoryPerGamePerUser(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, error)
	GetInPlayEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error)
	FancyBetsPerEventIdSports(ctx context.Context, eventId, userId string) ([]models.FancyBets, error)
	GetSingleTournamentSettings(ctx context.Context, game string) (*models.CombinedMatchSettings, error)
	GetSportsSettings(ctx context.Context, sportsId string) (*models.CombinedMatchSettings, error)
}

type sportsStore struct {
	*BaseStore
}

func NewSportsStore(db *pgxpool.Pool) SportsStore {
	return &sportsStore{BaseStore: NewBaseStore(db)}
}

func (s *sportsStore) GetActiveEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var events []models.ActiveEvents

	query := `
	SELECT 
		match_name, 
		event_id,
		competition_id,
		match_odds, 
		category,
		active,
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		active_events
	WHERE 
		sports_id = $1 AND is_declared = false AND active = true`

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
			&event.MatchOdds,
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

func (s *sportsStore) GetInPlayEvents(ctx context.Context, id string) (*[]models.ActiveEvents, error) {
	var events []models.ActiveEvents

	query := `
	SELECT 
		match_name, 
		event_id,
		competition_id,
		match_odds, 
		TO_CHAR(opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time
	FROM 
		active_events
	WHERE 
		sports_id = $1 
		AND is_declared = false
		AND active = true
		AND NOW() > opening_time`

	rows, err := s.db.Query(ctx, query, id)

	if err != nil {

		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var event models.ActiveEvents
		if err := rows.Scan(&event.EventName, &event.EventId, &event.CompetitionId, &event.MatchOdds, &event.EventTime); err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return &events, nil
}

func (s *sportsStore) FindMatchIDByEventID(ctx context.Context, tx pgx.Tx, id string) (string, error) {

	var Eventid string

	query := `SELECT id from active_events WHERE event_id = $1`

	err := tx.QueryRow(ctx, query, id).Scan(&Eventid)

	if err != nil {
		return "", fmt.Errorf("Failed to find match :%w", err)
	}

	return Eventid, nil
}

func (s *sportsStore) TransferBetValueToExposure(ctx context.Context, tx pgx.Tx, id string, amount float64) error {

	query := `
	UPDATE users 
	SET exposure = exposure + $1,
	balance = balance - $1
	WHERE id = $2 AND balance >= $1
`

	result, err := tx.Exec(ctx, query, amount, id)
	if err != nil {
		return fmt.Errorf("failed to debit balance: %w", err)
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return fmt.Errorf("insufficient balance for debit operation")
	}

	return nil

}

func (s *sportsStore) PlaceBet(ctx context.Context, tx pgx.Tx, payload models.PlaceBet, id string, profit, exposure float64) error {

	query := `INSERT INTO sport_bets 
	(match_id, event_id, user_id, odds_price, odds_rate, bet_type, market_name, market_id, runner_name, runner_id, market_type, profit, exposure)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`

	_, err := s.db.Exec(ctx, query, id,
		payload.MatchId,
		payload.UserId,
		payload.OddsPrice,
		payload.OddsRate,
		payload.BetType,
		payload.MarketName,
		payload.MarketId,
		payload.RunnerName,
		payload.RunnerID,
		payload.MarketType,
		profit,
		exposure,
	)

	if err != nil {
		log.Println(err)
		return fmt.Errorf("Failed to save bet :%w", err)
	}

	return nil
}

func (s *sportsStore) BetHistoryPerGamePerUser(ctx context.Context, userId, eventId string) (*[]models.BetHistoryPerGame, error) {

	var history []models.BetHistoryPerGame

	query := `SELECT 
	runner_name, odds_rate, exposure, profit, bet_type, market_type, runner_id, event_id 
	FROM sport_bets WHERE user_id = $1 AND event_id = $2 AND settled = false
	ORDER BY created_at DESC`

	rows, err := s.db.Query(ctx, query, userId, eventId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var row models.BetHistoryPerGame
		rows.Scan(&row.Selection, &row.Odds, &row.Stake, &row.PNL, &row.BetType, &row.MarketName, &row.RunnerId, &row.EventId)

		history = append(history, row)
	}

	return &history, nil
}

func (s *sportsStore) FancyBetsPerEventIdSports(ctx context.Context, eventId, userId string) ([]models.FancyBets, error) {

	var bets []models.FancyBets

	query := `SELECT runner_name, odds_rate, bet_type, SUM(exposure) AS total_exposure, SUM(profit) AS total_profit
			  FROM sport_bets 
			  WHERE settled = false 
              AND market_type = 'Fancy' 
              AND event_id = $1
			  AND user_id = $2
              GROUP BY runner_name, odds_rate, bet_type`

	rows, err := s.db.Query(ctx, query, eventId, userId)

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

func (s *sportsStore) GetSingleTournamentSettings(ctx context.Context, game string) (*models.CombinedMatchSettings, error) {

	var setting models.CombinedMatchSettings

	query := `SELECT tournament_name,
		pre_mo_stakes_min, pre_mo_stakes_max, 
		post_mo_stakes_min, post_mo_stakes_max, 
		pre_bm_stakes_min, pre_bm_stakes_max, 
		post_bm_stakes_min, post_bm_stakes_max, 
		pre_fancy_stakes_min, pre_fancy_stakes_max, 
		post_fancy_stakes_min, post_fancy_stakes_max, 
		toss_stakes_min, toss_stakes_max,
		bet_delay_mo, bet_delay_bm, bet_delay_to, bet_delay_fa,
		max_profit_mo, max_profit_bm, max_profit_to, max_profit_fa, 
		max_odds, active 
		FROM tournament_settings WHERE id = $1 AND active = true`

	err := s.db.QueryRow(ctx, query, game).Scan(
		&setting.TournamentName,
		&setting.PreMOStakesMin,
		&setting.PreMOStakesMax,
		&setting.PostMOStakesMin,
		&setting.PostMOStakesMax,
		&setting.PreBMStakesMin,
		&setting.PreBMStakesMax,
		&setting.PostBMStakesMin,
		&setting.PostBMStakesMax,
		&setting.PreFancyStakesMin,
		&setting.PreFancyStakesMax,
		&setting.PostFancyStakesMin,
		&setting.PostFancyStakesMax,
		&setting.TossStakesMin,
		&setting.TossStakesMax,
		&setting.BetDelayMO,
		&setting.BetDelayBM,
		&setting.BetDelayTO,
		&setting.BetDelayFA,
		&setting.MaxProfitMO,
		&setting.MaxProfitBM,
		&setting.MaxProfitTO,
		&setting.MaxProfitFA,
		&setting.MaxOdds,
		&setting.Active,
	)
	if err != nil {
		return nil, err
	}

	return &setting, nil
}

func (s *sportsStore) GetSportsSettings(ctx context.Context, sportsId string) (*models.CombinedMatchSettings, error) {

	var setting models.CombinedMatchSettings

	query := `SELECT max_stake, min_stake, before_max_stake, before_min_stake, max_odds, bet_delay FROM sports_settings WHERE id = $1`

	if err := s.db.QueryRow(ctx, query, sportsId).Scan(
		&setting.MaxStake,
		&setting.MinStake,
		&setting.BeforeInPlayMaxStake,
		&setting.BeforeInPlayMinStake,
		&setting.MaxOdds,
		&setting.BetDelay,
	); err != nil {
		return nil, err
	}

	return &setting, nil
}

// func (s *sportsStore) GetActiveEvents(ctx context.Context, id string) (*[]models.MatchDataWithSettings, error) {
// 	var events []models.MatchDataWithSettings

// 	query := `SELECT DISTINCT ON (e.event_id)
//     e.match_name,
//     e.event_id,
//     e.competition_id,
//     e.category,
// 	e.match_odds,
//     TO_CHAR(e.opening_time AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY, HH12:MI:SS') AS opening_time,
//     ss.name AS sport_name,
//     ss.max_stake,
//     ss.min_stake,
//     ss.before_max_stake,
//     ss.before_min_stake,
//     ss.max_odds,
//     ss.bet_delay,
//     ts.tournament_name,
//     ts.active AS tournament_active,
//     ts.pre_mo_stakes_min,
//     ts.pre_mo_stakes_max,
//     ts.post_mo_stakes_min,
//     ts.post_mo_stakes_max,
//     ts.pre_bm_stakes_min,
//     ts.pre_bm_stakes_max,
//     ts.post_bm_stakes_min,
//     ts.post_bm_stakes_max,
//     ts.pre_fancy_stakes_min,
//     ts.pre_fancy_stakes_max,
//     ts.post_fancy_stakes_min,
//     ts.post_fancy_stakes_max,
//     ts.toss_stakes_min,
//     ts.toss_stakes_max,
//     ts.bet_delay_mo,
//     ts.bet_delay_bm,
//     ts.bet_delay_to,
//     ts.bet_delay_fa,
//     ts.max_profit_mo,
//     ts.max_profit_bm,
//     ts.max_profit_to,
//     ts.max_profit_fa,
//     ts.max_odds AS tournament_max_odds
// FROM
//     active_events e
// LEFT JOIN
//     sports_settings ss ON e.sports_id = ss.id
// LEFT JOIN
//     tournament_settings ts ON e.sports_id = ts.sports_id
// WHERE
//     e.sports_id = $1
//     AND e.is_declared = false`

// 	rows, err := s.db.Query(ctx, query, id)

// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		var event models.MatchDataWithSettings
// 		if err := rows.Scan(
// 			&event.EventName,     // 1
// 			&event.EventId,       // 2
// 			&event.CompetitionId, // 3
// 			&event.Category,
// 			&event.MatchOdds,            // 5
// 			&event.EventTime,            // 6
// 			&event.Name,                 // 7
// 			&event.MaxStake,             // 8
// 			&event.MinStake,             // 9
// 			&event.BeforeInPlayMaxStake, // 10
// 			&event.BeforeInPlayMinStake,
// 			&event.MaxOdds,            // 11
// 			&event.BetDelay,           // 12
// 			&event.TournamentName,     // 13
// 			&event.Active,             // 14
// 			&event.PreMOStakesMin,     // 15
// 			&event.PreMOStakesMax,     // 16
// 			&event.PostMOStakesMin,    // 17
// 			&event.PostMOStakesMax,    // 18
// 			&event.PreBMStakesMin,     // 19
// 			&event.PreBMStakesMax,     // 20
// 			&event.PostBMStakesMin,    // 21
// 			&event.PostBMStakesMax,    // 22
// 			&event.PreFancyStakesMin,  // 23
// 			&event.PreFancyStakesMax,  // 24
// 			&event.PostFancyStakesMin, // 25
// 			&event.PostFancyStakesMax, // 26
// 			&event.TossStakesMin,      // 27
// 			&event.TossStakesMax,      // 28
// 			&event.BetDelayMO,         // 29
// 			&event.BetDelayBM,         // 30
// 			&event.BetDelayTO,         // 31
// 			&event.BetDelayFA,         // 32
// 			&event.MaxProfitMO,        // 33
// 			&event.MaxProfitBM,        // 34
// 			&event.MaxProfitTO,        // 35
// 			&event.MaxProfitFA,        // 36         // 37
// 			&event.TournamentMaxOdds,  // 38
// 		); err != nil {
// 			return nil, err
// 		}

// 		events = append(events, event)
// 	}

// 	return &events, nil
// }
