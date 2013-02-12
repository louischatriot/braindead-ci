/**
 * The application itself.
 */

var Job = require('./lib/job')
  , config = require('./lib/config')
  , customUtils = require('./lib/customUtils')
  , async = require('async')
  , jobsMetadata
  ;


/**
 * Load all the metadata for all jobs. Doesn't include build information
 */
function loadJobsmetadata (callback) {
  var res = {}
    , i = 0;

  Job.loadAllJobsNames(function (err, names) {
    if (err) { return callback(err); }

    async.whilst(
      function () { return i < names.length; }
    , function (cb) {
        var name = names[i];
        i += 1;
        res[name] = {};
        Job.loadConfig(name, function (err, config) {
          if (err) { return cb(err); }
          res[name].repo = config.repo;
          res[name].branch = config.branch;
          res[name].nextBuildNumber = config.nextBuildNumber;
          if (config.nextBuildNumber !== 0) {
            res[name].latestBuild = config.previousBuilds[(config.nextBuildNumber - 1).toString()];
          }
          cb();
        });
      }
    , function (err) {
        if (err) { return callback(err); }
        return callback(null, res);
      });
  });
}

/**
 * Initialize the application
 */
function init (callback) {
  customUtils.ensureFolderExists(config.workspace, function (err) {
    if (err) { return callback("Couldn't ensure the workspace exists"); }

    loadJobsmetadata(function (err, metadata) {
      if (err) { return callback("Couldn't load the jobs metadata"); }
      jobsMetadata = metadata;
      callback();
    });
  });
}


module.exports.init = init;
module.exports.jobsMetadata = jobsMetadata;
