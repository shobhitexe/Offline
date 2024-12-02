-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY, 
  username TEXT NOT NULL UNIQUE, 
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0.0,
  added_by INTEGER, 
  child_level INT NOT NULL CHECK (child_level IN (1, 2, 3, 4, 5, 6, 7, 8)),
  sports_share INT DEFAULT 0 CHECK (sports_share <= 100) NOT NULL,
  market_commission INT NOT NULL,
  session_commission INT NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_added_by FOREIGN KEY (added_by) REFERENCES admins(id) ON DELETE SET NULL
);
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
CREATE TABLE IF NOT EXISTS user_credits (
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
