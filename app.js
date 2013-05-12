var Job = require('./lib/job')
  , config = require('./lib/config')
  , customUtils = require('./lib/customUtils')
  , async = require('async')
  , fs = require('fs')
  , path = require('path')
  , server = require('./server')
  , db = require('./lib/db')
  , jobTypes = {}
  ;


/**
 * Initialize the list of job types
 * For now no plugin system is implemented, we only look at modules in the ./lib/jobTypes directory
 * @param {Function} callback Signature: err
 */
function initializeJobTypes (callback) {
  var nativeJobsTypesDirectory = './lib/jobTypes';

  fs.readdir(nativeJobsTypesDirectory, function (err, files) {
    if (err) { return callback(err); }

    async.each(files, function (file, cb) {
      var moduleName = path.join(nativeJobsTypesDirectory, file).replace(/\.js$/, '')
        , jobType
        ;

      if (!moduleName.match(/^\.\//)) {
        moduleName = './' + moduleName;
      }

      try {
        jobType = require(moduleName);
      } catch (e) {
        jobType = {};
      }

      if (jobType.populateBuildingSequence) {
        jobTypes[jobType.name] = jobType.populateBuildingSequence;
      }

      return cb();
    }, callback);
  });
}


/**
 * Get all job types
 */
function getAllJobTypes () {
  return jobTypes;
}


/**
 * Initialize the application
 */
function init (callback) {
  customUtils.ensureDirectoryExists(config.workspace, function (err) {
    if (err) { return callback("Couldn't ensure the workspace exists: " + err.toString()); }

    db.initialize(function (err) {
      if (err) { return callback("Couldn't initialize the database"); }

      initializeJobTypes(function (err) {
        server.launchServer(callback);
      });
    });
  });
}


/*
 * If we executed this module directly, launch the server.
 * If not, let the module which required server.js launch it.
 */
if (module.parent === null) {
  init(function (err) {
    if (err) {
      console.log("An error occured, logging error and stopping the server");
      console.log(err);
      process.exit(1);
    } else {
      console.log('Workspace found. Server started on port ' + config.serverPort);
    }
  });
}


// Interface
module.exports.getAllJobTypes = getAllJobTypes;
module.exports.init = init;
