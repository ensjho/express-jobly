/** Company class for express-jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require('../helpers/partialUpdate');


/** Companies  */

class Company {

  /**Gets a list of companies, returns the handle and name
   * of each company based on the query strings if provided.
   * Example: [
    {
      "handle": "",
      "name": "apple"
    },
    {
      "handle": "testhandle2",
      "name": "tesla"
    }
  ]
   */

  static async getCompanies(searchQuery){

    const baseString = `
      SELECT handle, name
        FROM companies
        `;

    let baseQuery = [];
    let sqlProtect = [];
    let idx = 1;

    // if search query parameter do exist, add an additional SQL string to the base Query
    if (searchQuery.search){
      let search = `name like $${idx}`;
      idx++;
      let sqlParam =  `%${searchQuery.search}%`;

      baseQuery.push(search);
      sqlProtect.push(sqlParam);
    }

    // if min_employees query parameter do exist, add an additional SQL string to the base Query
    if (searchQuery.min_employees){
      let minQuery = (`num_employees > $${idx}`);
      idx++;
      let sqlParam = searchQuery.min_employees;

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }

    // if max_employees query parameter do exist, add an additional SQL string to the base Query
    if (searchQuery.max_employees){
      let minQuery = (`num_employees < $${idx}`);
      idx++;
      let sqlParam = searchQuery.max_employees;

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }
    let finalQuery;

    // Only add WHERE in SQL statement if valid query parmeters do exist.
    if (baseQuery.length > 0){
      finalQuery = baseString + " WHERE " + baseQuery.join(" AND ");
    } else{
      finalQuery = baseString;
    }

    let result = await db.query(finalQuery, sqlProtect);
    
   return result.rows
  }

  /**Creates a company
    returns company created
    
    Example: 
    
    {
    "handle": "twitter",
    "name": "twitter",
    "num_employees": 400,
    "description": "you can tweet!",
    "logo_url": "www.twitter.com"
  }
   */
  static async createCompany(companyData){

    const test = await db.query(`
                                  SELECT handle 
                                  FROM companies
                                  WHERE handle = $1 OR name = $2`, 
                                  [companyData.handle, companyData.name]
                                )

    if (test.rows.length > 0){
      throw new ExpressError("Handle or name already exists!", 400)
    }

    const result = await db.query(`
                            INSERT INTO companies (handle, 
                                                   name,
                                                   num_employees, 
                                                   description, 
                                                   logo_url)
                            VALUES ($1, $2, $3, $4, $5)
                            RETURNING  handle, 
                                       name,
                                       num_employees, 
                                       description, 
                                       logo_url`,
                            [ companyData.handle,
                              companyData.name,
                              companyData.num_employees,
                              companyData.description,
                              companyData.logo_url,
                             ]
    );

    return result.rows[0];
  }

  /**Gets a single company and all the jobs with matching company_handles
    returns company
    
    Example: 
    
    {
    "handle": "testhandle1",
    "name": "apple",
    "num_employees": 600,
    "description": "Hello",
    "logo_url": "www.com",
      "jobs": [
        {
          "id": 1,
          "title": "testjob1",
          "salary": 100,
          "equity": 0.3,
          "date_posted": "2020-04-16T17:40:55.362Z"
        }
      ]
    }
   */

  static async getCompany(handle){
    let result = await db.query(`
                          SELECT 
                            c.handle, 
                            c.name, 
                            c.num_employees, 
                            c.description, 
                            c.logo_url,
                            j.id,
                            j.title,
                            j.salary,
                            j.equity,
                            j.date_posted

                          FROM companies as c
                            LEFT JOIN jobs AS j ON j.company_handle = c.handle
                            WHERE handle = $1
                            `, 
                          [handle]
                          );

    if(result.rows.length === 0){
      throw new ExpressError(`There is no company with that handle: ${handle}`, 404);
    }

    let jobs;
    if(result.rows[0].id === null){
      jobs = [];
    }else{
      jobs = result.rows.map(job => {

        return {
          id: job.id,
          title: job.title,
          salary: job.salary,
          equity: job.equity,
          date_posted: job.date_posted
        }
      });
    }

    const company = { handle: result.rows[0].handle, 
                      name: result.rows[0].name,
                      num_employees: result.rows[0].num_employees,
                      description: result.rows[0].description,
                      logo_url: result.rows[0].logo_url};

    
    company.jobs = jobs

    return company
  }

  /**Updates a single company 

  Example: 
    
    {
    "handle": "twitter",
    "name": "twitter",
    "num_employees": 400,
    "description": "you can tweet!",
    "logo_url": "www.twitter.com"
  }
  */

  static async updateCompany(handle, companyData){
    let { query, values } = sqlForPartialUpdate("companies", companyData, "handle", handle);

    const result = await db.query(query, values);

    if(result.rows.length === 0){
      throw new ExpressError(`There is no company with that handle: ${handle}`, 404);
    }
    
    return result.rows[0];
  }

/**Deletes a single company*/
  static async deleteCompany(handle){
    await db.query(`DELETE FROM companies
                    WHERE handle = $1 
                    RETURNING handle`,
                    [handle]);
  }
}




module.exports = Company;