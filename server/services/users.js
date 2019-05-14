const model = require('../db/models');
const mongoose = require('../db/index');
const Schema = mongoose.Schema;
const config = require('config');
const path = require('path');
const validate = require(path.resolve(__dirname, '../utils/validate'));
const serviceHelper = require('../utils/serviceHelper');
const bcrypt = require('bcrypt');
const token = require('../utils/token');

/**
 * Input: User profile details like user_name, password, first_name, last_name, mobile, etc
 * Processing: Santizing given inputs, encrypting password hash and inserting in into user_master table
 * Output: Successfull message in the response and unique identifier For eg. {id: '1', message: 'User has been created successfully'}
 */
async function addUser (options, callback) {
  try {
    let mandatoryFields = ['user_name', 'password', 'conf_password', 'email', 'first_name'];
    // Getting input fields
    let fields = serviceHelper.filterFields(model.UserMaster.schema.obj);
    let fieldTypeRestriction = {
      int: ['phone'],
      password: ['password'],
      equal: ['password:conf_password'],
      email: ['email']
    };
    await Promise.all([
      validate.checkMissingFields(options, mandatoryFields),
      validate.checkFields(options, fields),
      validate.checkFieldRestriction(options, fieldTypeRestriction)
    ]);
    let hash = await bcrypt.hashSync(options.password, config.get('SALTROUNDS'));
    options.password = hash;
    let result = await model.UserMaster.create(options);
    let response = {
      id: result.id,
      message: 'User Created Successfully'
    };
    callback(null, response);
  } catch (err) {
      let resErr = {
        message: err.message
      };
      callback(resErr, null)
  }
}

/*
 * Returns all users or particular user
 */
async function getUser (options, callback) {
  try {
    let userId = options.userId;
    if (userId !== undefined) {
      var result = await model.UserMaster.findById(userId);
    } else {
      result = await model.UserMaster.find();
    }
    let response = {
      data: result
    };
    callback(null, response);
  } catch (err) {
    let resErr = {
      message: err.message
    }
    callback(resErr, null)
  }
}

/*
 * Input: request body
 */
async function updateUser (options, callback) {
    try {
        let userId = options.userId;
        let fieldTypeRestriction = {
            int: ['userId']
          };
        await validate.checkFieldRestriction(options, fieldTypeRestriction);
        delete options.userId;
        let optionsKeys = Object.keys(options).filter(item => {
            return options[item] !== undefined;
        });
        if (options.password !== undefined) {
            let hash = await bcrypt.hashSync(options.password, config.get('SALTROUNDS'));
            options.password = hash;
        }
        let newOptions = {};
        for (let i = 0; i < optionsKeys.length; i++) {
            newOptions[optionsKeys[i]] = options[optionsKeys[i]];
        }
        let result = await model.UserMaster.updateOne({_id: userId}, options);
        if (result.nModified > 0) {
            var response = {
                id: result.id,
                message: 'User updated successfully'
            };
        } else {
            response = {
                message: 'There is nothing to update'
            }
        }
        callback(null, response);
    } catch (err) {
        let resErr = {
            message: err.message
        }
        callback(resErr, null)
    }
}

/**
 * Input: User Id
 * Processing: Delete record from user master table
 * Output: Message with id
 */
async function deleteUser (options, callback) {
    try {
      let userId = options.userId;
      let fieldTypeRestriction = {
        int: ['userId']
      };
      await validate.checkFieldRestriction(options, fieldTypeRestriction);
      let result = await model.UserMaster.deleteOne({_id: userId});
      if (result.deletedCount > 0) {
        var response = {
          message: 'User deleted successfully'
        };
      } else {
        response = {
          message: 'User already deleted.'
        }
      }
      callback(null, response);
    } catch (err) {
      let resErr = {
        message: err.message
      }
      callback(resErr, null)
    }
}

async function doLogin (options, callback) {
  try {
    let mandatoryFields = ['user_name', 'password'];
    // Getting input fields
    // let fields = serviceHelper.filterFields(model.UserMaster.schema.obj);
    await validate.checkMissingFields(options, mandatoryFields);
    let whereClause = {
        user_name: options.user_name
    };
    let user = await model.UserMaster.findOne(whereClause);
    if (user === undefined) {
        throw Error('Invalid username or password');
    }
    let bcryptres = bcrypt.compareSync(options.password, user.password);
    let response = {};
    if (bcryptres === true) {
        // generate token and send in response
        let tokenData = {
            user_name: user.user_name,
            user_id: user.id
        };
        let jswtToken = await token.generateToken(tokenData);
        response.token = jswtToken;
    } else {
        throw Error('Invalid password or username');
    }
    callback(null, response);
  } catch (err) {
    let resErr = {
      message: err.message
    }
    callback(resErr, null)
  }
}

async function logout (options, callback) {
    try {
      let response = await token.revokeToken(options);
      callback(null, response);
    } catch (err) {
      let resErr = {
        message: err.message
      }
      callback(resErr, null)
    }
  }

module.exports = {
    'addUser': addUser,
    'getUser': getUser,
    'updateUser': updateUser,
    'deleteUser': deleteUser,
    'doLogin': doLogin,
    'logout': logout
}