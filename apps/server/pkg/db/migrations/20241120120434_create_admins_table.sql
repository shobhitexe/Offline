-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY, 
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS login_histories (
  id SERIAL PRIMARY KEY,             
  user_id TEXT NOT NULL,            
  user_type TEXT CHECK (user_type IN ('admin', 'user')) NOT NULL, 
  login_ip TEXT NOT NULL,           
  user_agent TEXT NOT NULL,         
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_username FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE
);
-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS login_histories;
-- +goose StatementEnd
-- +goose StatementBegin
DROP TABLE IF EXISTS admins;
-- +goose StatementEnd
