-- DROP TABLE IF EXISTS locations;
-- DROP TABLE IF EXISTS weather;
-- DROP TABLE IF EXISTS events;

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255),
    display_name VARCHAR(255),
    latitude FLOAT(8),
    longitude FLOAT(8)
);

    
CREATE TABLE IF NOT EXISTS weather (
    id SERIAL PRIMARY KEY,
    forecast VARCHAR(255),
    time DATE
);  
    
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    link VARCHAR(255),
    name VARCHAR(255),
    summary VARCHAR(255),
    event_date DATE
);  
