/** Job class for express-jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require('../helpers/partialUpdate');

/** Jobs  */

class Job {

  /**Creates a job
    returns job created
    
    Example: 
    
  {
    "id": 9,
    "title": "testjob8",
    "salary": 200,
    "equity": 0.5,
    "company_handle": "testhandle1",
    "date_posted": "2020-04-16T17:43:19.938Z"
  }

   */
  static async createJob(jobData) {

    if (jobData.equity > 1) {
      throw new ExpressError("equity can not be greater than 1!", 400);
    }

    const result = await db.query(`
                            INSERT INTO jobs (title, 
                                              salary,
                                              equity, 
                                              company_handle, 
                                              date_posted)
                            VALUES ($1, $2, $3, $4, current_timestamp)
                            RETURNING  id, 
                                       title,
                                       salary, 
                                       equity, 
                                       company_handle`,
      [jobData.title,
      jobData.salary,
      jobData.equity,
      jobData.company_handle,
      ]
    );

    return result.rows[0];
  }

  /**Gets a list of jobs, returns the title and company_handles
  * based on the query strings if provided.
  * 
  * Example: 
     
     [
       {
         "title": "testjob1",
         "company_handle": "testhandle1"
       },
       {
         "title": "testjob2",
         "company_handle": "testhandle3"
       }
     ]
  */

  static async getJobs(searchQuery) {

    const baseString = `
      SELECT title, company_handle
        FROM jobs
        `;

    let baseQuery = [];
    let sqlProtect = [];
    let idx = 1;

    //if search query parameter does exist, add this to our base query
    if (searchQuery.search) {
      let search = `title like $${idx}`;
      idx++;
      let sqlParam = `%${searchQuery.search}%`;

      baseQuery.push(search);
      sqlProtect.push(sqlParam);
    }

    //if min_salary query parameter does exist, add this to our base query
    if (searchQuery.min_salary) {
      let minQuery = (`salary > $${idx}`);
      idx++;
      let sqlParam = searchQuery.min_salary;

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }

    //if min_equity query parameter does exist, add this to our base query
    if (searchQuery.min_equity) {
      let minQuery = (`equity > $${idx}`);
      idx++;
      let sqlParam = searchQuery.min_equity;

      baseQuery.push(minQuery);
      sqlProtect.push(sqlParam);
    }

    let finalQuery;

    //Only add WHERE in SQL statement given query parameters do exist;
    if (baseQuery.length > 0) {
      finalQuery = baseString + " WHERE " + baseQuery.join(" AND ");
    } else {
      finalQuery = baseString;
    }

    let result = await db.query(finalQuery, sqlProtect);

    return result.rows
  }

  /**Gets a single job
    returns job
    
    Example: 
    
    {
    "id": 4,
    "title": "testjob4",
    "salary": 400,
    "equity": 0.6,
    "company_handle": "testhandle3",
    "date_posted": "2020-04-16T17:40:55.362Z"
  }

  */

  static async getJob(id) {
    let result = await db.query(`
                          SELECT 
                            id, 
                            title, 
                            salary, 
                            equity, 
                            company_handle,
                            date_posted
                          FROM jobs
                          WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no job with that id: ${id}`, 404);
    }

    return result.rows[0];
  }

  /**Updates a single job
   * returns 

  Example: 
    
    {
    "id": 4,
    "title": "testjob8",
    "salary": 200,
    "equity": 0.5,
    "company_handle": "testhandle3",
    "date_posted": "2020-04-16T17:40:55.362Z"
  }

  */
  static async updateJob(id, jobData) {

    let { query, values } = sqlForPartialUpdate("jobs", jobData, "id", id);

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no company with that id: ${id}`, 404);
    }

    return result.rows[0];

  }

  /**Deletes a single job*/
  static async deleteJob(id) {
    await db.query(`DELETE FROM jobs
                    WHERE id = $1 
                    RETURNING id`,
                    [id]);
  }

}









module.exports = Job;