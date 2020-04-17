\c jobly-test

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS jobs;


CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL,
    num_employees INTEGER NOT NULL,
    description text,
    logo_url text
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp with time zone DEFAULT current_timestamp,
    CHECK (equity <= 1)
);
