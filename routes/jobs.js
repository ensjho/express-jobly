const express = require("express");
const router = new express.Router();
const Job = require('../models/job');

const { validate } = require("jsonschema");
const jobsNewSchema = require("../schemas/jobsNewSchema");
const jobsUpdateSchema = require("../schemas/jobsUpdateSchema");

const ExpressError = require("../helpers/expressError");

/**POST /jobs
  This should create a new job and return the newly created company.
  This should return JSON of {job: jobData}
*/

router.post('/', async function (req, res, next){
  try{

    const validation = validate(req.body, jobsNewSchema);

    if(!validation.valid){
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const job = await Job.createJob(req.body);
    return res.status(201).json({job});
  } catch(err){
    return next(err);
  }
})

/** GET /jobs'
 * Takes in three optional query parameters : search, min_salary, min_equity
 * This should return JSON of {jobs: [jobData, ...]}
*/

router.get('/', async function (req, res, next) {
  try{
    const searchQuery = req.query;
    const jobs = await Job.getJobs(searchQuery);
    return res.json({ jobs });

  } catch(err){
    next(err);
  }
})


/**GET /:id
 
This should return a single job found by its id.
This should return JSON of {job: jobData} 

*/
router.get('/:id', async function (req, res, next) {
  try{

    const jobID = req.params.id;

    const job = await Job.getJob(jobID);

    return res.json({ job });

  } catch(err){
    next(err);
  }
});

/*PATCH /:id

This should update an existing job and return the updated job.
This should return JSON of {job: jobData} 
*/
router.patch('/:id', async function(req, res, next){
  try{
    const validation = validate(req.body, jobsUpdateSchema);

    if(!validation.valid){
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const job = await Job.updateJob(req.params.id, req.body);

    return res.json({ job });

  }catch(err){
    return next(err);
  }
});

/*DELETE /:handle

This should remove an existing job and return a message.
This should return JSON of {message: "Job deleted"}
*/
router.delete('/:id', async function(req, res, next){
  try{
    await Job.deleteJob(req.params.id);

    return res.json({ message: "Job deleted" });
  }catch(err){
    return next(err);
  }
})

module.exports = router;