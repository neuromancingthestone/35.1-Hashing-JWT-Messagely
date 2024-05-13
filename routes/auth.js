const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");

const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async(req, res, next) => {
    try {
      let {username, password} = req.body;
      if(!username || !password) {
        throw new ExpressError("Username and password required", 400);
      }  
      if(await User.authenticate(username, password)) {
        let token = jwt.sign({username}, SECRET_KEY);
        const lastLogin = await User.updateLoginTimestamp(username);
        return res.json({ token });
      } else {
        throw new ExpressError("Invalid username/password", 400);
      }  
    } catch (e) {
      return next(e);
    }
  })

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async(req, res, next) => {
    try {
      const {username, password, first_name, last_name, phone} = req.body;
      if(!username || !password) {
        throw new ExpressError("Username and password required", 400);
      }
      const result = await User.register({
        username: username, 
        password: password, 
        first_name: first_name, 
        last_name: last_name, 
        phone: phone
      });
      let token = jwt.sign({username}, SECRET_KEY);
      return res.json({token});
  
    } catch (e) {
      if(e.code === '23505') {
        return next(new ExpressError("Username taken. Please choose another!", 400));
      }
      return next(e);
    }
})

module.exports = router;