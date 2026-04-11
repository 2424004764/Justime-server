CREATE TABLE IF NOT EXISTS records (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  title        TEXT,
  note         TEXT,
  location     TEXT,
  started_at   TEXT    NOT NULL,
  ended_at     TEXT    NOT NULL,
  duration     INTEGER NOT NULL,
  created_at   TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_records_user_id    ON records (user_id);
CREATE INDEX IF NOT EXISTS idx_records_title      ON records (user_id, title);
CREATE INDEX IF NOT EXISTS idx_records_started_at ON records (user_id, started_at DESC);
