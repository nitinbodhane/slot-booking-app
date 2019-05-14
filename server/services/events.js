const model = require('../db/models');
const mongoose = require('../db/index');
const Schema = mongoose.Schema;
const config = require('config');
const path = require('path');
const validate = require(path.resolve(__dirname, '../utils/validate'));
const serviceHelper = require('../utils/serviceHelper');

async function addEvent (options, callback) {
  try {
    let mandatoryFields = [];
    // Getting input fields
    let fields = serviceHelper.filterFields(model.Event.schema.obj);
    let fieldTypeRestriction = {
    };
    await Promise.all([
      validate.checkMissingFields(options, mandatoryFields),
      validate.checkFields(options, fields),
      validate.checkFieldRestriction(options, fieldTypeRestriction)
    ]);
    let result = await model.Event.create(options);
    let response = {
      id: result.id,
      message: 'Event Created Successfully'
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
 * Returns all events or particular event
 */
async function getEvent (options, callback) {
  try {
    let eventId = options.eventId;
    if (eventId !== undefined) {
      var result = await model.Event.findById(eventId);
    } else {
      result = await model.Event.find({}, {_id: 0, __v: 0, backgroundColor: 0});
    }
    let response = {
      data: result
    };
    callback(null, response);
  } catch (err) {
    console.log(err.stack);
    let resErr = {
      message: err.message
    }
    callback(resErr, null)
  }
}

/*
 * Input: request body
 */
async function updateEvent (options, callback) {
    try {
        let eventId = options.eventId;
        let fieldTypeRestriction = {
            int: ['eventId']
          };
        await validate.checkFieldRestriction(options, fieldTypeRestriction);
        delete options.eventId;
        let optionsKeys = Object.keys(options).filter(item => {
            return options[item] !== undefined;
        });
        let newOptions = {};
        for (let i = 0; i < optionsKeys.length; i++) {
            newOptions[optionsKeys[i]] = options[optionsKeys[i]];
        }
        let result = await model.Event.updateOne({_id: eventId}, options);
        if (result.nModified > 0) {
            var response = {
                id: result.id,
                message: 'Event updated successfully'
            };
        } else {
            response = {
                message: 'There is nothing to event'
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

async function deleteEvent (options, callback) {
    try {
      let eventId = options.eventId;
      let fieldTypeRestriction = {
        int: []
      };
      await validate.checkFieldRestriction(options, fieldTypeRestriction);
      let result = await model.Event.deleteOne({_id: eventId});
      if (result.deletedCount > 0) {
        var response = {
          message: 'Event deleted successfully'
        };
      } else {
        response = {
          message: 'Event already deleted.'
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

module.exports = {
    'addEvent': addEvent,
    'getEvent': getEvent,
    'updateEvent': updateEvent,
    'deleteEvent': deleteEvent
}