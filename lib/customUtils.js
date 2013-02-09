/**
 * Misc utils
 */

var config = require('./config')
  , fs = require('fs')
  ;


/**
 * Check if folder exists and create it on the fly if it is not the case
 */
module.exports.ensureFolderExists = function (folder, callback) {
  fs.exists(folder, function (exists) {
    if (exists) {
      return callback();
    } else {
      fs.mkdir(folder, '0664', callback);
    }
  });
};
