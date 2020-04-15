/** Company class for express-jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");


/** Companies  */

class Company {

  static async getCompanies(searchQuery){

    const baseString = `
      SELECT handle, name
        FROM companies
        `

    let baseQuery = [];
    let sqlProtect = [];
    let idx = 1

    if (searchQuery.search){
      let search = `name like $${idx}`
      idx++;
      let sqlParam =  `%${searchQuery.search}%`

      baseQuery.push(search);
      sqlProtect.push(sqlParam);
    }

    if (searchQuery.min_employees){
      let minQuery = (`num_employees > $${idx}`)
      idx++;
      let sqlParam = searchQuery.min_employees

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }

    if (searchQuery.max_employees){
      let minQuery = (`num_employees < $${idx}`)
      idx++;
      let sqlParam = searchQuery.max_employees

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }
    let finalQuery;

    if (baseQuery.length > 0){
      finalQuery = baseString + " WHERE " + baseQuery.join(" AND ");
    } else {
      finalQuery = baseString
    }

    console.log(finalQuery);
    console.log(sqlProtect);
    let result = await db.query(finalQuery, sqlProtect);
    
   return result.rows
  }

  static async createCompany(companyData){
    console.log("hello")
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

    return result.rows[0]
  }
}


module.exports = Company;