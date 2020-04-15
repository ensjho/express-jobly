\c jobly

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

    VALUES ('testhandle1', 'apple', '600','Hello','www.com'),
           ('testhandle2', 'tesla', '500','Hello','www.com'),
           ('testhandle3', 'tank', '300','Hello','www.com'),
          ('testhandle4', 'rithm', '200','Hello','www.com'),
          ('testhandle5', 'amazon', '100','Hello','www.com')
 