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
      fs.mkdir(folder, '0777', callback);
    }
  });
};


/**
 * Pipe a stream into another or several
 * @param {ReadableStream} stream The stream containing incoming data
 * @param {WritableStream / Array of WritableStreams} outs The stream or the array of streams to pipe stream into
 */
module.exports.pipeStreamIntoMultipleStreams = function (stream, outs) {
  if (outs instanceof Array === false) {
    stream.pipe(out);
    return;
  }

  outs.forEach(function (out) {
    stream.pipe(out);
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








