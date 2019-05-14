const express = require('express');
const router = express.Router();
const users = require('../services/users')

/* GET users listing. */
router.get('/:userId?', function(req, res, next) {
  let options = {
    userId: req.params.userId
  }

  users.getUser(options, async (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

/**
 * Input: user_name and password
 * Processing: Encrypting password and checking in the user_master table
 * Output: Return jwt token
 */
router.post('/login', function (req, res, next) {
  let options = {
    user_name: req.body.user_name,
    password: req.body.password,
  };

  users.doLogin(options, async (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

/**
 * Register user in the system
 */
router.post('/register', function (req, res, next) {
  let options = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    password: req.body.password,
    conf_password: req.body.conf_password,
    email: req.body.email,
    phone: req.body.phone,
    user_type: req.body.user_type
  }

  users.addUser(options, async (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

/**
 * Input: Token
 * Processing: Revoke the token, expire the token
 * Output: Successfull message in the response and unique identifier For eg. {id: '1', message: 'Logged out successfully'}
 */
router.post('/logout', function (req, res, next) {
  let options = {
    token: req.body.token
  };

  users.logout(options, async (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

module.exports = router;
