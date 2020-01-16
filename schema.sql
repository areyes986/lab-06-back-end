DROP TABLE IF EXISTS people;

CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(225),
    last_name VARCHAR(225)
);

INSERT INTO people (first_name, last_name) VALUES ('Ally', 'Reyes');