const config = require('config');

/**
 * @param {Date} Current Date
 */
function toIsoStringFormate (currDate) {
    try {
        var tzo = -currDate.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                var norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return currDate.getFullYear() +
            '-' + pad(currDate.getMonth() + 1) +
            '-' + pad(currDate.getDate()) +
            'T' + pad(currDate.getHours()) +
            ':' + pad(currDate.getMinutes()) +
            ':' + pad(currDate.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
    } catch (e) {
        console.log(e.stack);
        throw Error(e.stack);
    }
}

/**
 * Input: Email string
 * Processing: Validate email string
 * Output: Return true if valid else false
 */
function validateEmail (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return true;
    return false;
}

/*
This function is introduced to filter the fields that are not to be processed manually.
Input: @param1 Object of all fields from model
Output: Filtered array removing restricted fields.
*/
function filterFields (fieldObj) {
    let fields = config.get('RESTRICT_FIELDS');
    let validFields = Object.keys(fieldObj).filter((single) => {
      return !((fields.indexOf(single) > -1));
    });
    return validFields;
}

module.exports = {
    'toIsoStringFormate': toIsoStringFormate,
    'validateEmail': validateEmail,
    'filterFields': filterFields
}