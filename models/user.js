/** User class for express-jobly */
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require('../config');

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require('../helpers/partialUpdate');

/** Users  */


class User {

  /** Authenticate: is this username/password valid? Returns boolean. */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password
      FROM users
      WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (user) {
      return await bcrypt.compare(password, user.password) === true;
      
    } else {
      return false;
    }
  }

  /**Creates a user
    returns user created
    
    Example: 
    
  {
    "username": "ericj",
    "password": "$2b$12$rCmF2yl0tDf6WYYrTnD.T.fJZ2C7BBAAm6Rum1bJSe0DrDu2KZXUS",
    "first_name": "eric",
    "last_name": "j",
    "email": "eric@user.com",
    "photo_url": "www.google.com"
}

   */
  static async createUser(userData) {

    const test = await db.query(`
                                  SELECT username
                                  FROM users
                                  WHERE username = $1`,
                                  [userData.username]
                                )

    if (test.rows.length > 0){
      throw new ExpressError("Username already exists!", 400)
    }

    const hashedPassword = await bcrypt.hash(
      userData.password, BCRYPT_WORK_FACTOR);
  
    
    const result = await db.query(`
                            INSERT INTO users (username, 
                                              password,
                                              first_name, 
                                              last_name, 
                                              email,
                                              photo_url)
                            VALUES ($1, $2, $3, $4, $5, $6)
                            RETURNING  username, 
                                       password,
                                       first_name, 
                                       last_name, 
                                       email,
                                       photo_url`,
                            [userData.username,
                            hashedPassword,
                            userData.first_name,
                            userData.last_name,
                            userData.email,
                            userData.photo_url
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
          "username": "ericj",
          "first_name": "eric",
          "last_name": "j",
          "email": "eric@user.com"
        }
     ]
  */
  static async getUsers(){

    const result = await db.query(`SELECT 
                            username,
                            first_name,
                            last_name,
                            email
                            FROM users
                            ORDER BY username`);

    return result.rows;
  }

  /**Gets a single job
    returns job
    
    Example: 
    
    {
    "username": "gennam",
    "first_name": "genna",
    "last_name": "mer",
    "email": "test@user.com",
    "photo_url": "www.google.com"
  }

  */
  static async getUser(username) {
    let result = await db.query(`
                          SELECT 
                            username, 
                            first_name, 
                            last_name, 
                            email,
                            photo_url
                          FROM users
                          WHERE username = $1`,
                          [username]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no user with that username: ${username}`, 404);
    }

    return result.rows[0];
  }

  /**Updates a single user
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
 static async updateUser(username, userData) {

  let { query, values } = sqlForPartialUpdate("users", userData, "username", username);

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    throw new ExpressError(`There is no user with that username: ${username}`, 404);
  }

  return result.rows[0];

  }

  /**Deletes a single user*/
  static async deleteUser(username) {
    const result = await db.query(`DELETE FROM users
                  WHERE username = $1 
                  RETURNING username`,
                  [username]);
    
    if(result.rows.length === 0){
      throw new ExpressError(`There is no user with username: ${username}`, 404);
    }
  }
}

module.exports = User;