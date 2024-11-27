-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY, 
  username TEXT NOT NULL UNIQUE, 
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance INT NOT NULL DEFAULT 0,
  added_by INTEGER, 
  child_level INT CHECK (child_level IN (1,2,3,4,5,6,7,8)) NOT NULL,
  sports_share INT NOT NULL CHECK (sports_share <= 100),
  market_commission INT NOT NULL,
  session_commission INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose StatementBegin
-- Now add the foreign key constraint separately
ALTER TABLE admins 
  ADD CONSTRAINT fk_added_by FOREIGN KEY (added_by) REFERENCES admins(id) ON DELETE SET NULL;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS login_histories (
  id SERIAL PRIMARY KEY,             
  user_id INTEGER NOT NULL,  
  user_type TEXT CHECK (user_type IN ('admin', 'user')) NOT NULL, 
  login_ip TEXT NOT NULL,           
  user_agent TEXT NOT NULL,         
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_username FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE
);
-- +goose StatementEnd
