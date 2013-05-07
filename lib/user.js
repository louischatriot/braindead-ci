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

  if (!userData.login || !userData.login.match(/^[a-zA-Z0-9]{3,30}$/)) {
    errors.login = 'Your login should be an alphanumerical string, between 3 and 30 characters';
  }

  if (!userData.password || !userData.password.match(/^[a-zA-Z0-9]{6,}$/)) {
    errors.password = 'Your password should be an alphanumerical string, at least 6 characters';
  }

  return Object.keys(errors).length === 0 ? null : errors;
};

var u = { login: 'cc' };
console.log(User.validate(u));


/**
 * Create a user
 * @param {Object} userData
 * @param {Function} cb Optional callback, signature: err, user
 */
User.createUser = function (userData, cb) {
  var callback = cb || function () {};

  
};



// Interface
module.exports = User;
