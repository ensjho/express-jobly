/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require('../helpers/expressError');

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: check if user is admin. */

function isAdmin(req, res, next){
  try{

    if(!req.user){
      throw new ExpressError('user is not logged in', 401);
    }else if (!req.user.is_admin){
      throw new ExpressError('Must be admin to access', 401);
    }else if (req.user.is_admin === true){
      return next();
    }

  }catch(err){
    return next(err);
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}


module.exports = {
  authenticateJWT,
  isAdmin,
  ensureLoggedIn,
  ensureCorrectUser
}

