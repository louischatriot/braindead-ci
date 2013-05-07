var db = require('./db');


/**
 * Constructor
 */
function User (userData) {
  this.login = userData.login;
  this.password = userData.password;   // Encrypted password
}


/**
 * Find a user
 * @param {String} login
 * @param {Function} callback Signature: err, user
 */
User.getUser = function (login, callback) {
  db.users.findOne({ login: login }, function (err, userData) {
    if (err) { return callback(err); }

    if (!user) {
      return callback(null, null);
    } else {
      return callback(null, new User(userData));
    }
  });
};


/**
 * (Synchronous) validate a user data
 */
User.validate = function (userData) {
  var errors = {};

  if (!userData || !userData.login || !userData.login.match(/^[a-zA-Z0-9]{3,30}$/)) {
    errors.login = 'Your login should be an alphanumerical string, between 3 and 30 characters';
  }

  if (!userData || !userData.password || !userData.password.match(/^[a-zA-Z0-9]{6,}$/)) {
    errors.password = 'Your password should be an alphanumerical string, at least 6 characters';
  }

  return Object.keys(errors).length === 0 ? null : { validationErrors: errors };
};


/**
 * Create a user
 * @param {Object} userData
 * @param {Function} cb Optional callback, signature: err
 */
User.createUser = function (userData, cb) {
  var callback = cb || function () {}
    , errors = User.validate(userData)
    ;

  if (errors) { return callback(errors); }

  db.users.findOne({ login: userData.login }, function (err, user) {
    if (err) { return callback(err); }
    if (user) { return callback({ login: 'This login is already taken' }); }

    // TODO: encrypt password
    db.users.insert({ login: userData.login, password: userData.password }, callback);
  });
};


/**
 * Remove user
 * @param {String} login
 * @param {Function} cb Optional callback, signature: err
 */
User.removeUser = function (login, cb) {
  var callback = cb || function () {};

  db.users.findOne({ login: login }, function (err, user) {
    if (err) { return callback(err); }
    if (!user) { returncallback("User doesn't exist"); }

    db.users.remove({ login: login }, { multi: false }, function (err) { return callback(err); });
  });
};


/**
 * Check a user's credentials
 * @param {String} login
 * @param {String} password unencrypted
 * @param {Function} callback Signature: err, user
 */
User.checkCredentials = function (login, password, callback) {
  db.users.findOne({ login: login }, function (err, user) {
    if (err) { return callback(err); }
    if (!user) { return callback({ validationErrors: { userNotFound: 'Login not found' } }); }

    // TODO: With encryption
    if (user.password !== password) {
      return callback({ validationErrors: { wrongPassword: 'Wrong password' } });
    } else {
      return callback(null, user);
    }
  });
};


// Interface
module.exports = User;
