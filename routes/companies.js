const express = require("express");
const router = new express.Router();
const Company = require('../models/company');

const { validate } = require("jsonschema");
const companiesNewSchema = require("../schemas/companiesNewSchema");

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




  module.exports = router;