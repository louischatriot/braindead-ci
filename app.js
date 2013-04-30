var Job = require('./lib/job')
  , config = require('./lib/config')
  , customUtils = require('./lib/customUtils')
  , async = require('async')
  , jobsMetadata = {}
  , server = require('./server')
  ;


/**
 * Load the metadata for one job
 * Callback signature: err, jobMetadata
 */
function loadJobMetadata (name, callback) {
  Job.loadConfig(name, function (err, config) {
    var res = {};
    if (err) { return callback(err); }
    res.githubRepoUrl = config.githubRepoUrl;
    res.repoSSHUrl = config.repoSSHUrl;
    res.branch = config.branch;
    res.nextBuildNumber = config.nextBuildNumber;
    res.enabled = config.enabled;

    if (config.nextBuildNumber > 1) {
      res.latestBuild = config.previousBuilds[config.nextBuildNumber - 1];
    } else {
      res.latestBuild = null;
    }

    return callback(null, res);
  });
}


/**
 * Add job metadata to all the jobs metadata
 * Callback signature: err
 */
function updateJobMetadata (name, cb) {
  var callback = cb || function () {};

  loadJobMetadata(name, function (err, jobMetadata) {
    if (err) { return callback(err); }
    jobsMetadata[name] = jobMetadata;
    return callback();
  });
}


/**
 * Load all the metadata for all jobs. Doesn't include build information
 * Callback signature: err
 */
function loadAllJobsMetadata (callback) {
  var i = 0;

  Job.loadAllJobsNames(function (err, names) {
    if (err) { return callback(err); }

    async.whilst(
      function () { return i < names.length; }
    , function (cb) {
        var name = names[i];
        i += 1;
        updateJobMetadata(name, cb);
      }
    , function (err) {
        if (err) { return callback(err); }
        return callback(null);
      });
  });
}


/**
 * Change a job's name in the metadata
 */
function changeJobName (name, newName) {
  if (! jobsMetadata[name]) { return; }   // Nothing to change

  jobsMetadata[newName] = jobsMetadata[name];
  delete jobsMetadata[name];
}


/**
 * Returns the jobs metadata (figures ...)
 */
function getJobsMetadata () {
  return jobsMetadata;
}


/**
 * Initialize the application
 */
function init (callback) {
  customUtils.ensureFolderExists(config.workspace, function (err) {
    if (err) { return callback("Couldn't ensure the workspace exists"); }

    loadAllJobsMetadata(function (err) {
      if (err) { return callback("Couldn't load the jobs metadata"); }
      server.launchServer(callback);
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
      console.log('Workspace found. Server started on port ' + config.svPort);
    }
  });
}


// Interface
module.exports.init = init;
module.exports.getJobsMetadata = getJobsMetadata;
module.exports.updateJobMetadata = updateJobMetadata;
module.exports.changeJobName = changeJobName;
