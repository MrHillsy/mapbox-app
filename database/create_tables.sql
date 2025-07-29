-- -- Enable PostGIS extension
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- -- Create facilities table
-- CREATE TABLE IF NOT EXISTS facilities (
--     id BIGINT PRIMARY KEY,
--     name TEXT,
--     category TEXT,
--     city TEXT,
--     geom GEOGRAPHY(POINT, 4326)
-- );

-- -- Add spatial index for fast queries
-- CREATE INDEX IF NOT EXISTS facilities_geom_idx ON facilities USING GIST(geom);
