DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS holes CASCADE;
DROP TABLE IF EXISTS tees CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;


-- CREATE TABLE users (
--     user_id SERIAL PRIMARY KEY,
--     first_name VARCHAR(255) NOT NULL,
--     last_name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     hashed_password TEXT NOT NULL,
--     handicap INTEGER
-- );

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
    tee_id INTEGER REFERENCES Tees(tee_id),
    hole_number INTEGER NOT NULL,
    yardage INTEGER,
    par INTEGER,
    handicap INTEGER
);

CREATE TABLE rounds (
    round_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES Courses(course_id),
    date DATE NOT NULL
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    round_id INTEGER REFERENCES Rounds(round_id),
    user_id INTEGER REFERENCES Users(user_id),
    hole_id INTEGER REFERENCES Holes(hole_id),
    strokes INTEGER NOT NULL,
    UNIQUE (round_id, user_id, hole_id)

);
