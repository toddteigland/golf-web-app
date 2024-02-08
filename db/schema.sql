DROP TABLE IF EXISTS historical_scores CASCADE;
DROP TABLE IF EXISTS team_scores CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS holes CASCADE;
DROP TABLE IF EXISTS tees CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    handicap INTEGER,
    participating BOOLEAN
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    address TEXT
);

CREATE TABLE tees (
    tee_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES Courses(course_id),
    tee_name VARCHAR(255),
    color VARCHAR(50)
);

CREATE TABLE holes (
    hole_id SERIAL PRIMARY KEY,
    tee_id INTEGER REFERENCES tees(tee_id),
    hole_number INTEGER NOT NULL,
    yardage INTEGER,
    par INTEGER,
    handicap INTEGER,
    UNIQUE (tee_id, hole_number)
);

CREATE TABLE rounds (
    round_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES Courses(course_id),
    date DATE NOT NULL
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    round_id INTEGER REFERENCES rounds(round_id),
    user_id INTEGER REFERENCES users(user_id),
    hole_number INTEGER,
    -- tee_id INTEGER REFERENCES tees(tee_id),
    strokes INTEGER NOT NULL,
    UNIQUE (round_id, user_id, hole_number)

);

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL
);

CREATE TABLE team_members (
    team_member_id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(team_id),
    user_id INTEGER REFERENCES users(user_id),
    UNIQUE (team_id, user_id)
);

CREATE TABLE team_scores (
    team_score_id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(team_id),
    round_id INTEGER REFERENCES rounds(round_id),
    hole_number INTEGER,
    strokes INTEGER,
    drive_used VARCHAR(255) ,
    UNIQUE (round_id, team_id, hole_number)
);

CREATE TABLE historical_scores (
    historical_score_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    year INTEGER NOT NULL,
    round1score INTEGER,
    round2score INTEGER,
    handicap INTEGER,
    round1handicap INTEGER,
    round2handicap INTEGER
)
