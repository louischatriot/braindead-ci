/**
 * Misc utils
 */

var config = require('./config')
  , fs = require('fs')
  , path = require('path')
  , crypto = require('crypto')
  , childProcess = require('child_process')
  , util = require('util')
  , Stream = require('stream')
  , request = require('request')
  , async = require('async')
  ;


/**
 * Check if a directory exists and create it on the fly if it is not the case
 * cb is optional, signature: err
 */
function ensureDirectoryExists (dir, cb) {
  var callback = cb || function () {}
    ;

  childProcess.exec('mkdir -p ' + dir, function (err) { return callback(err); });
}
module.exports.ensureDirectoryExists = ensureDirectoryExists;


/**
 * Check that two files are identical.
 */
module.exports.checkIfFilesAreIdentical = function (file1, file2, callback) {
  fs.exists(file1, function (exists1) {
    fs.exists(file2, function (exists2) {

      if (! exists1 && ! exists2) { return callback(null, true); }
      if (! (exists1 && exists2)) { return callback(null, false); }

      fs.readFile(file1, 'utf8', function (err, data1) {
        if (err) { return callback(err); }
        fs.readFile(file2, 'utf8', function (err, data2) {
          if (err) { return callback(err); }

          if (data1 === data2) {
            return callback(null, true);
          } else {
            return callback(null, false);
          }
        });
      });
    });
  });
};


/**
 * Replace target by file
 * Erase target before copying if it exists
 * If file doesn't exist, also erase target
 */
module.exports.copySafe = function (file, target, callback) {
  async.waterfall([
    function (cb) {
    fs.exists(target, function (existsT) {
      if (!existsT) { return cb(); }
      fs.unlink(target, function (err) {
        return cb(err);
      });
    });
  }
  , function (cb) {
    fs.exists(file, function (existsF) {
      if (!existsF) { return cb(); }
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) { return cb(err); }
        fs.writeFile(target, data, 'utf8', function (err) {
          return cb(err);
        });
      });
    });
  }
  ], callback);
};


// Generates a random alphanumerical string of length len (very low probability for it to be of a smaller length)
function uid (len) {
  var randomString = crypto.randomBytes(Math.max(8, len * 2))
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, len);

  // If randomString is not of length len, retry
  // After tests, it turns out the probability of a retry is less than 1/1,000,000 so no risk of a too long recursion
  if (randomString.length === len) {
    return randomString;
  } else {
    return uid(len);
  }
}
module.exports.uid = uid;


/**
 * Sanitize a script by replacing all newlines (which are OS-dependent)
 * by semi colons if the end-of-line colon is missing and then
 * removing all new lines
 */
function sanitizeScript (script) {
  var res = script;

  res = res.replace(/([^;])\r\n/g, '$1;');
  res = res.replace(/\r\n/g, '');

  res = res.replace(/([^;])\r/g, '$1;');
  res = res.replace(/\r/g, '');

  res = res.replace(/([^;])\n/g, '$1;');
  res = res.replace(/\n/g, '');

  return res;
}


/**
 * Execute any bash script
 * Does it by copying it in a temporary file then using bash on it.
 * We do it this way to get the output of the script in real time
 * @param {String} script Script to execute, as a string
 * @param {Object} env Object containing any environment variables
 * @param {WritableStream} out All output logging goes here
 * @param {Function} callback To be called after script ends. Signature: err
 */
module.exports.executeBashScript = function (script, env, out, callback) {
  var executor
    , scriptFileName = config.workspace + '/_temp/script' + uid(13) + '.sh'
    , envKeys = Object.keys(env || {}), i
    , scriptEnv = process.env
    ;

  for (i = 0; i < envKeys.length; i += 1) {
    scriptEnv[envKeys[i]] = env[envKeys[i]];
  }

  script = sanitizeScript(script);
  ensureDirectoryExists(config.workspace + '/_temp', function (err) {
    if (err) { return callback(err); }

    fs.writeFile(scriptFileName, script, 'utf8', function (err) {
      if (err) { return callback(err); }

      executor = childProcess.spawn('bash', [scriptFileName], { env: scriptEnv });
      if (out) { executor.stdout.pipe(out, { end: false }); }
      if (out) { executor.stderr.pipe(out, { end: false }); }

      executor.on('exit', function (code) {
        var error = code === 0 ? null : "Script finished execution with an error";

        fs.unlink(scriptFileName, function () {
          callback(error);
        });
      });
    });
  });
};


/**
 * Transform an object indexed by numbers into an array indexed in the same order
 * Object must be indexed starting from 1, which is the case of the previousBuilds object
 */
module.exports.objectToArrayInOrder = function (obj) {
  var res = [], fields = Object.keys(obj), field, i;

  for (i = 0; i < fields.length; i += 1) {
    field = fields[i];
    res[parseInt(field, 10) - 1] = obj[field.toString()];
  }

  return res;
};


/**
 * Passthrough stream that can be written to and write to multiple streams
 * Written by Felix Geisendorfer
 */
function PassthroughStream() {
  this.writable = true;
  this.readable = true;
}
util.inherits(PassthroughStream, Stream);

PassthroughStream.prototype.write = function(data) {
  this.emit('data', data);
};

PassthroughStream.prototype.end = function() {
  this.emit('end');
};

PassthroughStream.prototype.destroy = function() {
  this.emit('close');
};

module.exports.PassthroughStream = PassthroughStream;


/**
 * Check if a setting isn't defined
 */
module.exports.settingDefined = function (setting) {
  if (setting === null || setting === undefined) { return false; }
  if (typeof setting === 'string' && setting.length === 0) { return false; }

  return true;
};


/**
 * Encrypt a password using node.js' crypto's PBKDF2
 * Description here: http://en.wikipedia.org/wiki/PBKDF2
 * Number of iterations are saved in case we change the setting in the future
 * @param {String} password
 * @param {Funtion} callback Signature: err, { salt, iterations, derivedKey }
 */
function encryptPassword (password, callback) {
  var randomSalt = uid(config.passwordEncryption.saltLength);

  crypto.pbkdf2(password, randomSalt, config.passwordEncryption.iterations, config.passwordEncryption.encryptedLength, function (err, derivedKey) {
    if (err) { return callback(err); }

    return callback(null, { salt: randomSalt, iterations: config.passwordEncryption.iterations, derivedKey: derivedKey });
  });
}
module.exports.encryptPassword = encryptPassword;


/**
 * Compare a password to an encrypted password
 * @param {String} password
 * @param {Object} encryptedPassword Same kind of object as returned by the encryption function
 * @param {Function} callback Signature: err, true/false
 */
function checkPassword (password, encryptedPassword, callback) {
  if (!encryptedPassword.salt || !encryptedPassword.derivedKey || !encryptedPassword.iterations) { return callback("encryptedPassword doesn't have the right format"); }

  // Use the encrypted password's parameter to hash the candidate password
  crypto.pbkdf2(password, encryptedPassword.salt, encryptedPassword.iterations, encryptedPassword.derivedKey.length, function (err, derivedKey) {
    if (err) { return callback(err); }

    if (derivedKey === encryptedPassword.derivedKey) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  });
}
module.exports.checkPassword = checkPassword;



