const validate = require('validate.js');
const validator = require('validator');
const config = require('config');
const moment = require('moment');

// Extend Validator for custom checks
validator.isDate = function (date) {
  var regex = new RegExp(config.get('DATE_REGEX'));
  var dateObj = moment(date, config.get('DATE_FORMAT')).toDate();
  return (regex.test(date) && (!isNaN(dateObj.getTime())));
};

validator.passwordCheck = function (password) {
  var regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?:.*[$@$!%*?&])?[A-Za-z\\d$@$!%*?&]{8,}');
  return (!validate.isEmpty(password) && regex.test(password));
};

validator.isEqual = function (param1, param2) {
  return (param1 === param2);
};

const checkFields = function (reqOptions, validFields) {
  return new Promise((resolve, reject) => {
    validFields.push('requser', 'baseurl'); // Whitelist reqUser,baseurl
    var rawBody = reqOptions.rawBody;
    if (rawBody !== undefined && rawBody !== '') {
      var rawBodyArray = rawBody.split('&');
      var rbParams = [];
      for (let i = 0, rbArrLength = rawBodyArray.length; i < rbArrLength; i++) {
        var temp = rawBodyArray[i].split('=');
        if (rbParams.indexOf(temp[0]) !== -1) {
          reject(Error('Duplicate Property ' + temp[0]));
        } else {
          rbParams.push(temp[0]);
        }
        if (temp[0].indexOf('%5B') !== -1) {
          continue;
        }
        if (validFields.indexOf(temp[0].toLowerCase()) === -1) {
            console.log('Invalid Property ' + temp[0] + ', valid properties are ' + validFields);
            //   logger.debug('Invalid Property ' + temp[0] + ', valid properties are ' + validFields);
          // reject(Error(config.get('ERROR_CODE')+'003:: Invalid Property ' + temp[0] + ', valid properties are ' + validFields));
          reject(Error('Invalid Property ' + temp[0]));
        }
      }
    } else {
        console.log('Empty request');
    //   logger.info('Empty request');
      // delete reqOptions.rawBody;
      // for (var supFields in reqOptions) {
      //   if (validFields.indexOf(supFields.toLowerCase()) === -1) {
      //     // reject(Error(config.get('ERROR_CODE')+'003:: Invalid Property ' + supFields + ', valid properties are ' + validFields));
      //     reject(Error('Invalid Property ' + supFields));
      //   }
      // }
    }
    console.log('Fields Validated');
    // logger.debug('Fields Validated');
    resolve('Fields validated successfully');
  });
};

const checkMissingFields = function (obj, mandatory) {
  return new Promise((resolve, reject) => {
    var merror = [];
    for (let i = 0, mLen = mandatory.length; i < mLen; i++) {
      if (obj[mandatory[i]] === undefined || obj[mandatory[i]] === '') {
        merror.push(mandatory[i]);
      }
    }
    if (merror.length === 0) {
      console.log('Manadtory fields present');
      resolve('All Mandatory fields present');
    } else {
      reject(Error('Mandatory fields::' + merror.join(',')));
    }
  });
};

const checkFieldRestriction = function (obj, fieldTypeRestriction) {
  return new Promise(async (resolve, reject) => {
    var ferror = {};
    for (var type in fieldTypeRestriction) {
      if (fieldTypeRestriction.hasOwnProperty(type)) {
        // Chose appropriate function for the field type check. Extend validator for custom checks
        switch (type) {
          case 'date':
            var valfunc = 'toDate';
            break;
          case 'int':
            valfunc = 'isInt';
            var valOptions = {min: 0};
            break;
          case 'password':
            valfunc = 'passwordCheck';
            break;
          case 'email':
            valfunc = 'isEmail';
            break;
          case 'equal':
            valfunc = 'isEqual';
            break;
        }
        for (let i = 0; i < fieldTypeRestriction[type].length; i++) {
          var params = [];
          // Pass in the param for the function
          var ftypeArray = fieldTypeRestriction[type][i].split(':'); // Check for ":" seperated values
          for (let j = 0; j < ftypeArray.length; j++) {
            if (obj[ftypeArray[j]] !== undefined) {
              params.unshift(obj[ftypeArray[j]]);
            }
          }
          if (valOptions !== undefined) {
            params.push(valOptions);
          }
          for (let k = 0; k < ftypeArray.length; k++) {
            if (obj[ftypeArray[k]] !== undefined) {
              if (!await validator[valfunc].apply(null, params)) {
                // Apply specified validator function with the params passed and check error
                if (ferror[type] === undefined) {
                  ferror[type] = [];
                }
                ferror[type].push(fieldTypeRestriction[type][i]);
              }
            }
          }
        }
      }
    }
    if (Object.keys(ferror).length === 0) {
      console.log('Field types validated successfully');
      resolve('Field types validated successfully');
    } else {
      let msg = {};
      var skipDefault = ['password', 'equal']; // Custom Messages for these fields
      for (var ftype in ferror) {
        if (skipDefault.indexOf(ftype) === -1) {
          // Default message
          let defMsg = ferror[ftype].join(',') + ' should be valid and of type ' + ftype + '.';
          msg[ftype] = msg[ftype] ? msg[ftype].concat(defMsg) : defMsg;
        }
        switch (ftype) {
          case 'date':
            let dateAddMsg = ' (expected format ' + config.get('DATE_FORMAT') + ')';
            msg[ftype] = msg[ftype] ? msg[ftype].concat(dateAddMsg) : dateAddMsg;
            break;
          case 'password':
            let pwdAddMsg = 'Invalid ' + ftype + '. Password requirements: at least 8 characters, a lowercase letter, an uppercase letter, a number.';
            msg[ftype] = msg[ftype] ? msg[ftype].concat(pwdAddMsg) : pwdAddMsg;
            break;
          case 'equal':
            for (let i = 0; i < ferror[ftype].length; i++) {
              var eqArr = ferror[ftype][i].split(':');
              let equalAddMsg = eqArr.join(', ') + ' should be equal';
              msg[eqArr[0]] = msg[eqArr[0]] ? msg[eqArr[0]].concat(equalAddMsg) : equalAddMsg;
            }
            break;
        }
      }
      reject(Error(':: ' + JSON.stringify(msg)));
    }
  });
};

const compareDates = function (startDate, endDate) {
  return new Promise((resolve, reject) => {
    if (typeof startDate === 'object') {
      var startDateKey = Object.keys(startDate)[0];
      startDate = startDate[startDateKey];
    } else {
      startDateKey = 'Start Date';
    }
    if (typeof endDate === 'object') {
      var lastDateKey = Object.keys(endDate)[0];
      endDate = endDate[lastDateKey];
    } else {
      lastDateKey = 'End Date';
    }
    console.log('Comparing two dates');
    if (startDate < endDate) {
      console.log(`${startDateKey} is LESS than ${lastDateKey}`);
      resolve(`${startDateKey} is less than ${lastDateKey}`);
    } else {
      console.log(`${startDateKey} is GREATER than ${lastDateKey}`);
      reject(Error(`:: ${startDateKey} is GREATER than ${lastDateKey}.`));
    }
  });
};

module.exports = {
  'checkFields': checkFields,
  'checkMissingFields': checkMissingFields,
  'checkFieldRestriction': checkFieldRestriction,
  'compareDates': compareDates
};
