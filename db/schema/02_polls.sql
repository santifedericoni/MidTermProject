-- Drop and recreate polls table

DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  date_created DATE NOT NULL,
  completed BOOLEAN
)
