const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Job = require("../../models/job");
const Company = require("../../models/company");

process.env.NODE_ENV = 'test';

describe("job Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM jobs");

    await Company.createCompany({
      "handle": "testHandle1",
      "name": "test name",
      "num_employees": 350,
      "description": "This is a test!",
      "logo_url": "www.test.com"
    });

    await Job.createJob({
      "title": "testTitle",
      "salary": 650000,
      "equity": 0.5,
      "company_handle": "testHandle1",
    });
  });

  describe("GET /jobs and query strings", function(){
    /* Get all jobs, test the response and status code 200 */
    test("Get all jobs with no query string", async function () {
      const response = await request(app).get('/jobs');

      expect(response.statusCode).toBe(200);
      expect(response.body.jobs.length).toEqual(1);
    });
  });

    // /**Get all companies with search query string get response 200 */
    // test("Get all companies with search query string", async function (){
    //   const response = await request(app).get('/companies?search=test');

    //   expect(response.statusCode).toBe(200);
    //   expect(response.body).toEqual({
    //     "companies": [
    //                   {
    //                     "handle": "test",
    //                     "name": "test name"
    //                   }
    //                 ]
    //   });
    // });

  //   /**Get all companies with mulitple query strings get response 200 */
  //   test("Get all companies with search, min_employees, max_employees query strings", async function (){
  //     const response = await request(app).get(
  //       '/companies?search=test&min_employees=300&max_employees=400');

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual({
  //       "companies": [
  //                     {
  //                       "handle": "test",
  //                       "name": "test name"
  //                     }
  //                   ]
  //     });
  //   });

  //   // Test where min is greater than max
  //   /* get company with wrong query string parameters respond with query string 400*/
  //   test("Wrong query string parameters", async function(){
  //     const response = await request(app).get('/companies?min_employees=700&max_employees=300');

  //     expect(response.statusCode).toBe(400);
  //     expect(response.body).toEqual({
  //       "status": 400,
  //       "message": "max employees CAN NOT be greater than min employees"
  //     });
  //   });

  // });

  // describe("GET /companies/:handle", function(){
  //   /* Get a company, get status code 200 */

  //   test("get a company", async function(){
  //     const response = await request(app).get('/companies/test');
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.company).toEqual({
  //         "handle": "test",
  //         "name": "test name",
  //         "num_employees": 350,
  //         "description": "This is a test!",
  //         "logo_url": "www.test.com"
  //     });
  //   });

  //   /** Get a company where the handle does not exist, respond with 400*/

  //   test('Get invalid handle', async function(){
  //     const response = await request(app).get('/companies/bean');
  //     expect(response.statusCode).toBe(404);
  //   });

  // });

  // describe("POST /companies", function(){
  //   /** Create company return with status code 201 */

  //   test("Create a company", async function () {
  //     const response = await request(app)
  //       .post('/companies')
  //       .send({
  //         handle: "secondTest",
  //         name: "second",
  //         num_employees: 600,
  //         description: "TESTTTTTTTT!",
  //         logo_url: "www.second.com"
  //       });
  //       expect(response.statusCode).toBe(201);
  //       expect(response.body.company.handle).toEqual("secondTest");

      
  //     // check the company is in the database by making a get request
  //     let getCompanyTest = await request(app).get('/companies');
  //     expect(getCompanyTest.body.companies.length).toEqual(2);
  //   });
    
  //   /** Create company with already existing handle return with status code 500 */
  //   test("make a post to a handle that already exists", async function(){
  //     const response = await request(app)
  //       .post('/companies')
  //       .send({
  //         handle: "test",
  //         name: "test name",
  //         num_employees: 350
  //       });

  //     expect(response.statusCode).toBe(400);
  //     expect(response.body).toEqual({
  //       "status": 400,
  //       "message": "Handle already exists! Select another handle!"
  //     });
  //   });
  // });

  // describe("PATCH /companies:handle", function(){
  //   /** Update a company return with status code of 200 */
  //   test("tests partial update of a company", async function(){
  //     const response = await request(app)
  //       .patch('/companies/test')
  //       .send({
  //         name: "Eric"
  //     });
    
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.company.name).toEqual('Eric'); 
  //   });

  //   /** Update a company return with status code of 400 */
  //   test("tests invalid update of a company", async function(){
  //     const response = await request(app)
  //       .patch('/companies/test')
  //       .send({handle: 'Genna'});

  //     expect(response.statusCode).toBe(400);
  //   });

  // });

  // describe('DELETE /companies:handle', function(){
  //   // Test deleting a company, return status 200

  //   test("test deleting a company", async function(){
  //     const response = await request(app).delete('/companies/test');
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual({
  //       "message": "Company deleted"
  //     });

  //     const getResponse = await request(app).get('/companies');
  //     expect(getResponse.body.companies.length).toEqual(0);
  //   });
  // });
});

afterAll(async function () {
  // close db connection
  await db.end();
});