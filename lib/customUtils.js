/**
 * Misc utils
 */

var config = require('./config')
  , fs = require('fs')
  , validators = {}
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


