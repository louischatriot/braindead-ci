/**
 * Misc utils
 */

var config = require('./config')
  , fs = require('fs')
  , crypto = require('crypto')
  , childProcess = require('child_process')
  , util = require('util')
  , Stream = require('stream')
  , request = require('request')
  , async = require('async')
  ;


/**
 * Check if folder exists and create it on the fly if it is not the case
 */
function ensureFolderExists (folder, callback) {
  fs.exists(folder, function (exists) {
    if (exists) {
      return callback();
    } else {
      fs.mkdir(folder, '0777', callback);
    }
  });
}
module.exports.ensureFolderExists = ensureFolderExists;


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
// Taken from Connect
function uid (len) {
  return crypto.randomBytes(Math.ceil(len))
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, len);
}
module.exports.uid = uid;


/**
 * Execute any bash script
 * Does it by copying it in a temporary file then using bash on it.
 * We do it this way to get the output of the script in real time
 * @param {String} script Script to execute, as a string
 * @param {WritableStream} out All output logging goes here
 * @param {Function} callback To be called after script ends
 */
module.exports.executeBashScript = function (script, out, callback) {
  var executor
    , scriptFileName = config.workspace + '/_temp/script' + uid(13) + '.sh'
    ;

  ensureFolderExists(config.workspace + '/_temp', function (err) {
    if (err) { return callback(err); }

    fs.writeFile(scriptFileName, script, 'utf8', function (err) {
      if (err) { return callback(err); }

      executor = childProcess.spawn('bash', [scriptFileName], {});
      if (out) { executor.stdout.pipe(out, { end: false }); }
      if (out) { executor.stderr.pipe(out, { end: false }); }

      executor.on('exit', function (code) {
        var error = code === 0 ? null : "Error while executing script";

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
 * Send a message to Hipchat (asynchronously). data must contain the following properties
 *  * room_id
 *  * from - arbitrary name
 *  * message_format - 'text' or 'html'
 *  * message
 *  * notify - 1 or 0
 *  * color - 'yellow', 'red', 'green', 'purple', 'gray' or 'random'
 */
module.exports.sendMessageToHipchat = function (data) {
  var uri = "https://api.hipchat.com/v1/rooms/message?format=json&auth_token=" + config.hipchatToken
    , keys = Object.keys(data);

  keys.forEach(function (key) {
    uri += '&' + key + '=' + encodeURIComponent(data[key]);
  });

  request.get({ headers: {"Accept": "application/json"}, uri: uri});
}




