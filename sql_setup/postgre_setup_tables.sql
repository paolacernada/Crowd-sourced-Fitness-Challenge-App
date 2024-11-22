CREATE TABLE badges (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL
);

CREATE TABLE difficulty (
  id bigint primary key generated always as identity,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE challenges (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL,
  long_description VARCHAR(1000) NOT NULL,
  difficulty VARCHAR(10) NOT NULL,
  FOREIGN KEY (difficulty) REFERENCES difficulty(name) ON DELETE CASCADE
);



CREATE TABLE goals (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(300) NOT NULL
);

-- The following adds the Supabase UUID and username
-- But I had to keep the username nullable for now, until I either insert values to all the users or completely reenter all data for all tables.
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) UNIQUE NOT NULL,
  registration_date TIMESTAMP DEFAULT NOW(),
  uuid uuid DEFAULT gen_random_uuid() NOT NULL,  -- Supabase Auth UUID, nullable.  Todo: add UNIQUE
  username VARCHAR(50) UNIQUE NOT NULL  -- New username field   NOTE: I 
);

-- Previous table
-- CREATE TABLE users (
--   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   name VARCHAR(50) UNIQUE NOT NULL,
--   registration_date TIMESTAMP DEFAULT NOW(),
--   uuid uuid,  -- Supabase Auth UUID, nullable.  Todo: add UNIQUE
--   username VARCHAR(50) UNIQUE NOT NULL  -- New username field   NOTE: I 
-- );

CREATE TABLE tags (
  id bigint primary key generated always as identity,
  name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE challenge_goals (
  id bigint primary key generated always as identity,
  challenge_id bigint NOT NULL,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  goal_id bigint NOT NULL,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE TABLE challenge_tags (
  id bigint primary key generated always as identity,
  challenge_id INT,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  tag_id INT,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE users_badges (
    id bigint primary key generated always as identity,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- Factor in this (uuid is now an item here):
-- ALTER TABLE users_challenges
-- ADD COLUMN user_uuid uuid;
CREATE TABLE users_challenges (
  id bigint primary key generated always as identity,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  challenge_id INT,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,  -- Whether the user has completed the challenge
  favorites BOOLEAN DEFAULT FALSE,  -- Whether the user has completed the challenge
  UNIQUE (user_id, challenge_id)  -- Ensures a user can only have one status for each challenge
);

CREATE TABLE user_settings (
  id bigint primary key generated always as identity,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  notifications BOOLEAN DEFAULT FALSE, 
  data_sharing BOOLEAN DEFAULT FALSE,
  language VARCHAR(50) DEFAULT 'English'
  );

CREATE TABLE user_goals (
  id SERIAL PRIMARY KEY, 
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  goal_id INT REFERENCES goals(id) ON DELETE CASCADE,
  challenge_id INT REFERENCES challenges(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,  -- This indicates whether the user has completed the goal or not
  UNIQUE (user_id, goal_id, challenge_id)  -- Prevents duplicate goals being added to user
);

