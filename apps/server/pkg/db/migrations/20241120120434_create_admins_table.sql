-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY, 
  username TEXT NOT NULL UNIQUE, 
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  exposure NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  added_by INTEGER, 
  child_level INT NOT NULL CHECK (child_level IN (1, 2, 3, 4, 5, 6, 7, 8)),
  sports_share INT DEFAULT 0 CHECK (sports_share <= 100) NOT NULL,
  market_commission INT NOT NULL,
  session_commission INT NOT NULL,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose StatementBegin
ALTER TABLE admins 
  ADD CONSTRAINT fk_added_by FOREIGN KEY (added_by) REFERENCES admins(id) ON DELETE SET NULL;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,          
  username TEXT NOT NULL UNIQUE, 
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0.0,
  market_commission INT NOT NULL,
  session_commission INT NOT NULL,
  added_by INTEGER,   
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_added_by FOREIGN KEY (added_by) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION notify_balance_update() 
RETURNS trigger AS $$
BEGIN
  IF NEW.balance <> OLD.balance THEN
    PERFORM pg_notify('balance_update', 
                      'User ID: ' || NEW.id || ', New Balance: ' || NEW.balance);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER balance_update_trigger
AFTER UPDATE OF balance ON users
FOR EACH ROW
EXECUTE FUNCTION notify_balance_update();
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
  amount NUMERIC NOT NULL,
  remarks TEXT,
  txn_type TEXT CHECK (txn_type IN ('debit', 'credit')) NOT NULL, 
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
  amount NUMERIC NOT NULL,
  remarks TEXT,
  txn_type TEXT CHECK (txn_type IN ('debit', 'credit')) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_from_id FOREIGN KEY (from_id) REFERENCES admins(id) ON DELETE CASCADE,
  CONSTRAINT fk_admin_id FOREIGN KEY (to_id) REFERENCES admins(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS active_events (
    id SERIAL PRIMARY KEY,
    sports_id INTEGER CHECK (sports_id IN (4, 2, 1)) DEFAULT 4,
    match_name TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    competition_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'open', 'close', 'locked', 'active')) DEFAULT 'active',
    is_declared BOOLEAN DEFAULT FALSE,
    opening_time TIMESTAMP NOT NULL,
    match_odds_runners JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  profit NUMERIC(12, 2) NOT NULL CHECK (profit > 0), 
  exposure NUMERIC(12, 2) NOT NULL DEFAULT 0.0 CHECK (exposure >= 0),
  settled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_match_id FOREIGN KEY (match_id) REFERENCES active_events(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd