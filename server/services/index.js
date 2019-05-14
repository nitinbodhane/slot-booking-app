const model = require('../db/models');
const mongoose = require('../db/index');
const Schema = mongoose.Schema;

/*
 * Input: request body
 */
async function addTask (options, callback) {
    try {
        if (options.message.length === 0) {
            throw Error('Blank message not allowed');
        }
        if (options.phone.length !== 10) {
            throw Error('Phone number should be 10 digit');
        }
        let result = await model.Task.create(options);
        var response = {
            id: result.id,
            message: 'Task saved successfully'
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
 * Returns all task or particular task
 */
async function getTask (options, callback) {
    try {
        if (options.taskId !== undefined) {
            var result = await model.Task.findById(options.taskId);
        } else {
            result = await model.Task.find();
        }
        var response = {
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
async function updateTask (options, callback) {
    try {
        let taskId = options.taskId;
        delete options.taskId;
        let optionsKeys = Object.keys(options).filter(item => {
            return options[item] !== undefined;
        });
        let newOptions = {};
        for (let i = 0; i < optionsKeys.length; i++) {
            newOptions[optionsKeys[i]] = options[optionsKeys[i]];
        }
        let result = await model.Task.updateOne({_id: taskId}, options);
        if (result.nModified > 0) {
            var response = {
                id: result.id,
                message: 'Task updated successfully'
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

/*
 * Input: request body
 */
async function deleteTask (options, callback) {
    try {
        let taskId = options.taskId;
        let result = await model.Task.deleteOne({_id: taskId});
        if (result.deletedCount > 0) {
            var response = {
                message: 'Task deleted successfully'
            };
        } else {
            response = {
                message: 'Task already deleted.'
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

// async function sendSms (options, callback) {
//     try {
//         if (options.message_id === undefined) {
//             throw Error('Please send valid message id');
//         }
//         var result = await model.Task.findById(options.message_id);
//         if (result === null) {
//             throw Error('Task is not available, Please send valid id');
//         }
//         // cookie = await way2sms.login('9869173528', 'k8999B');
//         cookie = await way2sms.login('8108841379', 'apexdead');
//         // cookie = await way2sms.reLogin('9869173528', 'k8999B');
//         await way2sms.send(cookie, String(result.phone), result.message);
//         var response = {
//             phone: result.phone,
//             message: 'Sms sent successfully'
//         };
//         callback(null, response);
//     } catch (err) {
//         let resErr = {
//             message: err.message
//         }
//         callback(resErr, null)
//     }
// }

module.exports = {
    'addTask': addTask,
    'getTask': getTask,
    'updateTask': updateTask,
    'deleteTask': deleteTask
}