const express = require("express");
const router = new express.Router();
const Company = require('../models/company');

const { validate } = require("jsonschema");
const companiesNewSchema = require("../schemas/companiesNewSchema");
const companiesUpdateSchema = require("../schemas/companiesUpdateSchema");

const ExpressError = require("../helpers/expressError");

/** GET /companies'
 * Takes in three optional query parameters : search, min_employees, max_employees
 * This should return JSON of {companies: [companyData, ...]}
*/

router.get('/', async function (req, res, next) {
  try{
    const searchQuery = req.query;

    if (Number(req.query.max_employees) < Number(req.query.min_employees)){
      throw new ExpressError("max employees CAN NOT be greater than min employees", 400)
    }
    const companies = await Company.getCompanies(searchQuery);
    return res.json({ companies });

  } catch(err){
    next(err);
  }
})

/**POST /companies
  This should create a new company and return the newly created company.
  This should return JSON of {company: companyData}
*/

router.post('/', async function (req, res, next){
  try{
    const validation = validate(req.body, companiesNewSchema);

    if(!validation.valid){
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const company = await Company.createCompany(req.body);

    return res.status(201).json({company});
  } catch(err){
    return next(err);
  }
})

/**GET /:handle
 
This should return a single company found by its id and all the jobs with the same company_handle.
This should return JSON of {company: {...companyData, jobs: [job, ...]}};

*/
router.get('/:handle', async function (req, res, next) {
  try{

    const companyHandle = req.params.handle;

    const company = await Company.getCompany(companyHandle);

    return res.json({ company });

  } catch(err){
    next(err);
  }
});

/*PATCH /:handle

This should update an existing company and return the updated company.
This should return JSON of {company: companyData} 
*/
router.patch('/:handle', async function(req, res, next){
  try{
    const validation = validate(req.body, companiesUpdateSchema);

    if(!validation.valid){
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const company = await Company.updateCompany(req.params.handle, req.body);

    return res.json({ company });

  }catch(err){
    return next(err);
  }
});

/*DELETE /:handle

This should remove an existing company and return a message.
This should return JSON of {message: "Company deleted"}
*/
router.delete('/:handle', async function(req, res, next){
  try{
    await Company.deleteCompany(req.params.handle);

    return res.json({ message: "Company deleted" });
  }catch(err){
    return next(err);
  }
})







  module.exports = router;