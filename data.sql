\c jobly

DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;



CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text UNIQUE NOT NULL,
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
    -- TODO: less than 0
    CHECK (equity <= 1 AND equity > 0)
);

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    photo_url text,
    is_admin boolean NOT NULL DEFAULT false
);

INSERT INTO companies (
              handle,
              name,
              num_employees,
              description,
              logo_url
            )       

    VALUES ('testhandle1', 'apple', '600','Hello','www.com'),
           ('testhandle2', 'tesla', '500','Hello','www.com'),
           ('testhandle3', 'tank', '300','Hello','www.com'),
          ('testhandle4', 'rithm', '200','Hello','www.com'),
          ('testhandle5', 'amazon', '100','Hello','www.com');


INSERT INTO jobs (
              title,
              salary,
              equity,
              company_handle
            )       

    VALUES ('testjob1', 100, 0.3,'testhandle1'),
           ('testjob2', 200, 0.4,'testhandle3'),
           ('testjob3', 300, 0.5,'testhandle3'),
           ('testjob4', 400, 0.6,'testhandle3'),
           ('testjob5', 500, 0.7,'testhandle2');


