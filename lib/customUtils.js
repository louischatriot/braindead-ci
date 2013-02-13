/**
 * Misc utils
 */

var config = require('./config')
  , fs = require('fs')
  , util = require('util')
  , Stream = require('stream')
  , request = require('request')
  ;


/**
 * Check if folder exists and create it on the fly if it is not the case
 */
module.exports.ensureFolderExists = function (folder, callback) {
  fs.exists(folder, function (exists) {
    if (exists) {
      return callback();
    } else {
      fs.mkdir(folder, '0777', callback);
    }
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
