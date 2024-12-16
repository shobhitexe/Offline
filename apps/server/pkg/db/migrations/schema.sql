-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY, 
  username TEXT NOT NULL UNIQUE, 
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance NUMERIC(20, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  settlement NUMERIC(20, 2) NOT NULL DEFAULT 0.0,
  added_by INTEGER NOT NULL,
  downline INTEGER NOT NULL DEFAULT 0, 
  child_level INT NOT NULL CHECK (child_level IN (1, 2, 3, 4, 5, 6, 7, 8)),
  sports_share INT DEFAULT 0 CHECK (sports_share <= 100) NOT NULL,
  market_commission INT NOT NULL,
  session_commission INT NOT NULL,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_added_by FOREIGN KEY (added_by) REFERENCES admins(id) ON DELETE SET NULL;
);
-- +goose StatementEnd


-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,          
  username TEXT NOT NULL UNIQUE, 
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance NUMERIC(20, 2) NOT NULL DEFAULT 0.0 CHECK (balance >= 0),
  exposure NUMERIC(20, 2) NOT NULL DEFAULT 0.0,
  settlement NUMERIC(20, 2) NOT NULL DEFAULT 0.0,
  credit_ref NUMERIC(20, 2) NOT NULL DEFAULT 0.0,
  market_commission INT NOT NULL,
  session_commission INT NOT NULL,
  added_by INTEGER,   
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_added_by FOREIGN KEY (added_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- CREATE OR REPLACE FUNCTION notify_balance_update() 
-- RETURNS trigger AS $$
-- BEGIN
--   IF NEW.balance <> OLD.balance THEN
--     PERFORM pg_notify('balance_update', 
--                       'User ID: ' || NEW.id || ', New Balance: ' || NEW.balance);
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;


-- CREATE TRIGGER balance_update_trigger
-- AFTER UPDATE OF balance ON users
-- FOR EACH ROW
-- EXECUTE FUNCTION notify_balance_update();
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS login_histories (
  id SERIAL PRIMARY KEY,             
  user_id INTEGER,
  admin_id INTEGER,  
  user_type TEXT CHECK (user_type IN ('admin', 'user')) NOT NULL, 
  login_ip TEXT NOT NULL,           
  user_agent TEXT NOT NULL,         
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
-- +goose StatementEnd


-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user_txns (
  id SERIAL PRIMARY KEY,             
  user_id INTEGER,
  admin_id INTEGER,
  amount NUMERIC(20, 2) NOT NULL,
  remarks TEXT,
  txn_type TEXT CHECK (txn_type IN ('debit', 'credit')) NOT NULL,
  wallet_type TEXT CHECK (wallet_type IN ('credit','cash')) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
-- +goose StatementEnd



-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admin_txns (
  id SERIAL PRIMARY KEY,             
  from_id INTEGER,
  to_id INTEGER,
  amount NUMERIC(20, 2) NOT NULL,
  remarks TEXT,
  txn_type TEXT CHECK (txn_type IN ('debit', 'credit')) NOT NULL, 
  wallet_type TEXT CHECK (wallet_type IN ('credit','cash')) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_from_id FOREIGN KEY (from_id) REFERENCES admins(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_id FOREIGN KEY (to_id) REFERENCES admins(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS active_events (
    id SERIAL PRIMARY KEY,
    sports_id INTEGER CHECK (sports_id IN (4, 2, 1)) NOT NULL,
    match_name TEXT NOT NULL,
    category TEXT NOT NULL,
    event_id INTEGER NOT NULL UNIQUE,
    competition_id INTEGER NOT NULL,
    is_declared BOOLEAN DEFAULT FALSE,
    opening_time TIMESTAMP NOT NULL,
    runners JSON,
    match_odds JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sports_id FOREIGN KEY (sports_id) REFERENCES sports_settings(id) ON DELETE CASCADE,
    CONSTRAINT fk_competition_id FOREIGN KEY (competition_id) REFERENCES tournament_settings(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS sport_bets (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL,
  event_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  market_name TEXT NOT NULL,
  market_id TEXT NOT NULL,
  runner_name TEXT NOT NULL,
  runner_id TEXT NOT NULL,
  market_type TEXT CHECK (market_type IN ('Bookmaker', 'Match Odds','Fancy')) NOT NULL,
  odds_price NUMERIC(10, 2) NOT NULL,
  odds_rate NUMERIC(10, 2) NOT NULL,
  bet_type TEXT CHECK (bet_type IN ('back', 'lay','no','yes')) NOT NULL,
  profit NUMERIC(20, 2) NOT NULL CHECK (profit > 0), 
  exposure NUMERIC(20, 2) NOT NULL DEFAULT 0.0 CHECK (exposure >= 0),
  settled BOOLEAN DEFAULT FALSE,
  result TEXT CHECK(result IN ('win','loss')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_match_id FOREIGN KEY (match_id) REFERENCES active_events(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS runner_results (
    id SERIAL PRIMARY KEY,
    event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    runner_name TEXT NOT NULL UNIQUE,
    runner_id TEXT NOT NULL UNIQUE,
    run INTEGER NOT NULL,
    is_declared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS sports_settings (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  max_stake INTEGER NOT NULL,
  min_stake INTEGER NOT NULL,
  before_max_stake INTEGER NOT NULL,
  before_min_stake INTEGER NOT NULL,
  max_odds INTEGER NOT NULL,
  bet_delay INTEGER NOT NULL
);

INSERT INTO sports_settings 
(id, name, max_stake, min_stake, before_max_stake, before_min_stake, max_odds, bet_delay)
VALUES 
  (1, 'Soccer', 100000, 100, 100000, 100, 10, 1),
  (2, 'Tennis', 100000, 100, 100000, 100, 10, 1),
  (4, 'Cricket', 100000, 100, 100000, 100, 10, 1);

-- +goose StatementEnd

CREATE TABLE IF NOT EXISTS tournament_settings (
    id INTEGER PRIMARY KEY,
    tournament_name TEXT NOT NULL,
    sports_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT false NOT NULL,
    
    -- Pre MO stakes
    pre_mo_stakes_min INTEGER,
    pre_mo_stakes_max INTEGER,
    
    -- Post MO stakes
    post_mo_stakes_min INTEGER,
    post_mo_stakes_max INTEGER,
    
    -- Pre BM stakes
    pre_bm_stakes_min INTEGER,
    pre_bm_stakes_max INTEGER,
    
    -- Post BM stakes
    post_bm_stakes_min INTEGER,
    post_bm_stakes_max INTEGER,
    
    -- Pre Fancy stakes
    pre_fancy_stakes_min INTEGER,
    pre_fancy_stakes_max INTEGER,
    
    -- Post Fancy stakes
    post_fancy_stakes_min INTEGER,
    post_fancy_stakes_max INTEGER,

    -- Toss stakes
    toss_stakes_min INTEGER,
    toss_stakes_max INTEGER,
    
    -- Bet Delay    
    bet_delay_mo INTEGER,
    bet_delay_bm INTEGER,
    bet_delay_to INTEGER,
    bet_delay_fa INTEGER,

    -- Max Profit
    max_profit_mo INTEGER,
    max_profit_bm INTEGER,
    max_profit_to INTEGER,
    max_profit_fa INTEGER,

    -- Max Odds
    max_odds INTEGER
);