-- Insert starter user data
INSERT INTO users (name)
VALUES
('Sam'),
('Paola'),
('Natalia');

-- Insert starter badges data
INSERT INTO badges (name, description)
VALUES
('Dedication', 'Exercised 3 times this week'),
('Superstar', 'Exercised 5 times this week'),
('Strong Start', 'Completed first goal')

CREATE TABLE badges (
  id bigint primary key generated always as identity,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL
);

-- Insert difficulty data. This table is not modifiable.
INSERT INTO difficulty (name)
VALUES
('Easy'),
('Medium'),
('Hard');

-- Insert starter challenges data
INSERT INTO challenges (name, description, long_description, difficulty)
VALUES
('Run a mile', 'Go from zero to able to run a mile', 'Go from zero to able to run a mile-- you can do this!', 'Easy'),
('Run a 5k', 'Go from a mile to a 5k', 'Up your game a bit-- go from a mile to a 5k', 'Easy'),
('Run a half-marathon', 'Go from a 5k to a half-marathon', 'Work up from 5k to a half-marathon', 'Medium'),
('Run a marathon', 'Go from a half-marathon to a full marathon', 'Right! From a half-marathon all the way up to a full marathon', 'Hard')

-- Insert starter goals data
INSERT INTO goals (name, description)
VALUES
    ('5 times', 'Participate 5 times'),
    ('10 times', 'Participate 10 times'),
    ('15 times', 'Participate 15 times')

-- Insert starter tags data
INSERT INTO tags (name)
VALUES
('superstar'),
('dedication'),
('fitness');

-- Insert starter challenge_goals data
INSERT INTO challenge_goals (challenge_id, goal_id) 
VALUES
(1, 3),
(2, 1),
(3, 2)
;

-- Insert starter challenge_tags data
INSERT INTO challenge_tags (challenge_id, tag_id) 
VALUES
(1, 2),
(2, 3),
(3, 1)
;

-- Insert starter users_badges data
INSERT INTO users_badges (user_id, badge_id)
VALUES
(1, 3),
(2, 2),
(3, 1)

-- Insert starter chaellnge-goals data
INSERT INTO challenge_goals (challenge_id, goal_id) 
VALUES
(1, 3),
(1, 4),
(2, 2),
(2, 3)
(3, 1),
(3, 3)
;

-- Insert starter users_challenges data
INSERT INTO users_challenges (user_id, challenge_id) 
VALUES
(1, 3),
(1, 5),
(1, 8),
(2, 3),
(2, 4),
(2, 8),
(3, 4),
(3, 6),
(3, 8),
(61, 3),
(61, 4),
(61, 5),
(64, 5),
(64, 6),
(64, 8)
;

-- Insert starter user_settings data
INSERT INTO user_settings (user_id, notifications, data_sharing) 
VALUES
(1, False, False),
(2, False, False),
(3, False, False)
;

INSERT INTO user_goals (user_id, goal_id, challenge_id) 
VALUES
(1, 1, 2),
(2, 2, 3),
(3, 3, 4)
;
