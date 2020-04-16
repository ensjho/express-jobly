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
      "handle": "testhandle1",
      "name": "apple"
    },
    {
      "handle": "testhandle2",
      "name": "tesla"
    }
  ]
   */

  // TODO: add comments
  static async getCompanies(searchQuery){

    const baseString = `
      SELECT handle, name
        FROM companies
        `;

    let baseQuery = [];
    let sqlProtect = [];
    let idx = 1;

    if (searchQuery.search){
      let search = `name like $${idx}`;
      idx++;
      let sqlParam =  `%${searchQuery.search}%`;

      baseQuery.push(search);
      sqlProtect.push(sqlParam);
    }

    if (searchQuery.min_employees){
      let minQuery = (`num_employees > $${idx}`);
      idx++;
      let sqlParam = searchQuery.min_employees;

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }

    if (searchQuery.max_employees){
      let minQuery = (`num_employees < $${idx}`);
      idx++;
      let sqlParam = searchQuery.max_employees;

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }
    let finalQuery;

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

  /**Gets a single company
    returns company
    
    Example: 
    
    {
    "handle": "twitter",
    "name": "twitter",
    "num_employees": 400,
    "description": "you can tweet!",
    "logo_url": "www.twitter.com"
  }
   */

  static async getCompany(handle){
    let result = await db.query(`
                          SELECT 
                            handle, 
                            name, 
                            num_employees, 
                            description, 
                            logo_url
                          FROM companies
                          WHERE handle = $1`, 
                          [handle]
                          );

    if(result.rows.length === 0){
      throw new ExpressError(`There is no company with that handle: ${handle}`, 404);
    }
    return result.rows[0];
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
      throw new ExpressError(`There is no company with that ${handle}`, 404);
    }
    return result.rows[0];
  }

/**Deletes a single company*/
  static async deleteCompany(handle){
    let result = await db.query(`
                          DELETE FROM companies
                          WHERE handle = $1 
                          RETURNING handle`,
                          [handle]);
  }
}




module.exports = Company;