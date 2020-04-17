const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { validate } = require("jsonschema");
const usersNewSchema = require("../schemas/usersNewSchema");
const usersUpdateSchema = require("../schemas/usersUpdateSchema");

const SECRET_KEY = require('../config');

const ExpressError = require("../helpers/expressError");

const{ ensureCorrectUser } = require('../middleware/auth');


/**POST /users
  This should create a new user and return the newly created user.
  This should return JSON of {user: userData}
*/

router.post('/', async function (req, res, next) {
  try {

    const validation = validate(req.body, usersNewSchema);
    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }
    const user = await User.createUser(req.body);
    let token = jwt.sign({username: user.username, is_admin: user.is_admin}, SECRET_KEY);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

/** GET /users'
 * This should return JSON of {users: [userData, ...]}
*/
router.get('/', async function(req, res, next){
  try{

    const users = await User.getUsers();

    return res.json({ users })
  }catch(err){
    return next(err);
  }
});

/**GET /:username
 
This should return a single user found by its username.
This should return JSON of {user: userData} 

*/
router.get('/:username', async function (req, res, next) {
  try {

    const user = await User.getUser(req.params.username);

    return res.json({ user });

  } catch (err) {
    return next(err);
  }
});

/*PATCH /:username

This should update an existing user and return the updated user.
This should return JSON of {user: userData} 
*/
router.patch('/:username', ensureCorrectUser, async function (req, res, next) {
  try {
    const validation = validate(req.body, usersUpdateSchema);

    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const user = await User.updateUser(req.params.username, req.body);

    return res.json({ user });

  } catch (err) {
    return next(err);
  }
});

/*DELETE /:username

This should remove an existing user and return a message.
This should return JSON of {message: "User deleted"}
*/
router.delete('/:username', ensureCorrectUser, async function (req, res, next) {
  try {
    await User.deleteUser(req.params.username);

    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;