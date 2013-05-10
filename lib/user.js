var db = require('./db')
  , customUtils = require('./customUtils')
  ;


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

    if (!userData) {
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

  if (!userData || !userData.password || !userData.password.match(/^.{6,}$/)) {
    errors.password = 'Your password should be at least 6 characters long';
  }

  return Object.keys(errors).length === 0 ? null : { validationErrors: errors };
};


/**
 * Create a user
 * @param {Object} userData
 * @param {Function} cb Optional callback, signature: err, newUser
 */
User.createUser = function (userData, cb) {
  var callback = cb || function () {}
    , errors = User.validate(userData)
    ;

  if (errors) { return callback(errors); }

  db.users.findOne({ login: userData.login }, function (err, user) {
    if (err) { return callback(err); }
    if (user) { return callback({ login: 'This login is already taken' }); }

    customUtils.encryptPassword(userData.password, function (err, encryptedPassword) {
      if (err) { return callback(err); }
      db.users.insert({ login: userData.login, password: encryptedPassword }, callback);
    });
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

    customUtils.checkPassword(password, user.password, function (err, ok) {
      if (err) { return callback(err); }

      if (!ok) {
        return callback({ validationErrors: { wrongPassword: 'Wrong password' } });
      } else {
        return callback(null, user);
      }
    });
  });
};


/**
 * Change a user's password
 * @param {Function} cb Optional callback, signature: err
 */
User.changePassword = function (login, password, newPassword, cb) {
  var callback = cb || function () {};

  db.users.findOne({ login: login }, function (err, user) {
    if (err) { return callback(err); }
    if (!user) { return callback('User not found'); }

    customUtils.checkPassword(password, user.password, function (err, ok) {
      if (err) { return callback(err); }
      if (!ok) { return callback('Wrong current password supplied'); }
      if (!newPassword.match(/^.{6,}$/)) { return callback('Your password should be at least 6 characters long'); }

      customUtils.encryptPassword(newPassword, function (err, encryptedPassword) {
        if (err) { return callback(err); }

        user.password = encryptedPassword;
        db.users.update({ _id: user._id }, user, { multi: false }, function (err) { return callback(err); });
      });
    });
  });
};


/**
 * Check whether the user db is empty or not
 * Callback signature: true/false (assume err means db not empty for security)
 */
User.userDbEmpty = function (callback) {
  db.users.findOne({}, function (err, user) {
    if (err || user) {
      return callback(false);
    } else {
      return callback(true);
    }
  });
};


/**
 * Get the list of all users
 * @param {Function} callback Signature: err, users
 */
User.getAllUsers = function (callback) {
  db.users.find({}, callback);
};


// Interface
module.exports = User;
