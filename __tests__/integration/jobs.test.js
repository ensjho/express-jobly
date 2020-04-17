const request = require("supertest");
const app = require("../../app");
const db = require("../../db");
const Job = require("../../models/job");
const Company = require("../../models/company");

process.env.NODE_ENV = 'test';

describe("job Routes Test", function () {
  let jobId;

  beforeEach(async function () {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies")

    await Company.createCompany({
      "handle": "testHandle1",
      "name": "test name",
      "num_employees": 350,
      "description": "This is a test!",
      "logo_url": "www.test.com"
    });

    let job = await Job.createJob({
      "title": "testTitle",
      "salary": 650000,
      "equity": 0.5,
      "company_handle": "testHandle1",
    });

    jobId = job.id;
  });

  describe("GET /jobs and query strings", function(){
    /* Get all jobs, test the response and status code 200 */
    test("Get all jobs with no query string", async function () {
      const response = await request(app).get('/jobs');

      expect(response.statusCode).toBe(200);
      expect(response.body.jobs.length).toEqual(1);
      // TODO: test response body
    });
  

    /**Get all jobs with search query string get response 200 */
    test("Get all jobs with search query string", async function (){
      const response = await request(app).get('/jobs?search=test');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "jobs": [
                      {
                        "title": "testTitle",
                        "company_handle": "testHandle1"
                      }
                    ]
      });
    });

    /**Get all jobs with mulitple query strings get response 200 */
    test("Get all jobs with search, min_salary, min_equity query strings", async function (){
      const response = await request(app).get(
        '/jobs?search=test&min_salary=600&min_equity=0.2');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "jobs": [
                  {
                    "title": "testTitle",
                    "company_handle": "testHandle1"
                  }
                ]
        });
    });

    // Test where min_equity is greater than 1
    /* Respond with query string 400*/
    test("min_equity is greater than 1", async function(){
      const response = await request(app).get('/jobs?min_equity=2');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({"jobs": []});
    });

  });

  describe("GET /jobs/:id", function(){
    /* Get a job, get status code 200 */

    test("get a job", async function(){
      const response = await request(app).get(`/jobs/${jobId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.job.id).toEqual(jobId);
    });

    /** Get a company where the handle does not exist, respond with 400*/

    test('Get invalid id', async function(){
      const response = await request(app).get('/jobs/17');
      expect(response.statusCode).toBe(404);
      //TODO response body
    });
  });

  describe("POST /jobs", function(){
    /** Create job return with status code 201 */

    test("Create a job", async function () {
      const response = await request(app)
        .post('/jobs')
        .send({
          title: "new job",
          salary: 700,
          equity: 0.3,
          company_handle: "testHandle1"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.job.title).toEqual("new job");
        // TODO response body

      
      // check the job is in the database by making a get request
      let getJobTest = await request(app).get('/jobs');
      expect(getJobTest.body.jobs.length).toEqual(2);
    });

    /** Create an ivalid job return status code 400 */
    test("make a post where quity is greater than 1", async function(){
      const response = await request(app)
        .post('/jobs')
        .send({
          title: "another new",
          salary: 700,
          equity: 5,
          company_handle: "testHandle1"
        });

        expect(response.statusCode).toBe(400);
    });

  });
  describe("PATCH /jobs:id", function(){
    /** Update a job return with status code of 200 */
    test("tests partial update of a job", async function(){
      const response = await request(app)
        .patch(`/jobs/${jobId}`)
        .send({
          title: "Eric"
        });
    
      expect(response.statusCode).toBe(200);
      expect(response.body.job.title).toEqual('Eric'); 
    });
    
    /** Update a job return with status code of 400 */
    test("tests invalid update of a job", async function(){
      const response = await request(app)
        .patch(`/jobs/${jobId}`)
        .send({id: 5});

      expect(response.statusCode).toBe(400);
    });
  });

  describe('DELETE /jobs:id', function(){
    
    // Test deleting a job, return status 200
    test("test deleting a job", async function(){
      const response = await request(app).delete(`/jobs/${jobId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "message": "Job deleted"
      });

      const getResponse = await request(app).get('/jobs');
      expect(getResponse.body.jobs.length).toEqual(0);
    });
  });
});

afterAll(async function () {
  // close db connection
  await db.end();
});