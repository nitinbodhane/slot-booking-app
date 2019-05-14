const config = require('config');
const moment = require('moment');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const model = require('../db/models');

async function generateToken (data) {
  try {
    const jwtConf = config.get('JWT');
    let expiry = moment().add(config.get('EXPIRATION_TIME'), 'seconds');
    let token = {
      'iss': config.get('BASE_URL'),
      'sub': data.user_id,
      'user_name': data.user_name,
      'exp': expiry.unix(),
      'iat': moment().unix()
    };
    const privateKey = fs.readFileSync(jwtConf.privateKey);
    const jwtToken = jwt.sign(token, privateKey, {
      algorithm: 'RS256'
    });
    let tokenDb = {
      value: jwtToken,
      user_id: token.sub,
      expiration_date: expiry.toDate(),
      date_created: new Date(),
      created_by: data.user_name
    };
    await model.Token.create(tokenDb);
    return jwtToken;
  } catch (err) {
    throw Error(err);
  }
}

async function revokeToken (data, callback) {
    let reqToken = data.token;
    if (reqToken === undefined) {
      var errC = await error.getError(Error('Token not provided'));
      callback(errC.msg, null);
    }
    let token = await model.Token.findOne({
      where: {
        value: reqToken
      }
    });
    if (token !== null) {
        throw Error('Invalid token');
    }
    let someVar = await model.Token.deleteOne({value: reqToken});
    if (someVar.deletedCount === 0) {
        throw Error('Token could not revoke');
    }
    return {
      msg: 'Token Revoked'
    };
}

module.exports = {
    "generateToken": generateToken,
    "revokeToken": revokeToken
}