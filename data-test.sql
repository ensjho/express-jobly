\c jobly-test

DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL,
    num_employees INTEGER NOT NULL,
    description text,
    logo_url text
);

INSERT INTO companies (
              handle,
              name,
              num_employees,
              description,
              logo_url
            )       
    VALUES ('testhandle', 'Apple', '100','Hello','www.com');