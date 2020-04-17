const express = require('express');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async function(req, res, next) {
  try {
    const { username, password, is_admin } = req.body;
    const result = await User.authenticate(username, password)
    if (result) {
      let token = jwt.sign({username, is_admin}, SECRET_KEY);
      return res.json( {token} )
    }else{
      throw new ExpressError('login failed', 400);
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;