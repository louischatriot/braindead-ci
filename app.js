var Job = require('./lib/job')
  , config = require('./lib/config')
  , customUtils = require('./lib/customUtils')
  , async = require('async')
  , jobsMetadata = {}
  ;


/**
 * Load the metadata for one job
 * Callback signature: err, jobMetadata
 */
function loadJobMetadata (name, callback) {
  Job.loadConfig(name, function (err, config) {
    var res = {};
    if (err) { return cb(err); }
    res.githubRepoUrl = config.githubRepoUrl;
    res.repoSSHUrl = config.repoSSHUrl;
    res.branch = config.branch;
    res.nextBuildNumber = config.nextBuildNumber;
    if (config.nextBuildNumber !== 0) {
      res.latestBuild = config.previousBuilds[(config.nextBuildNumber - 1).toString()];
    }

    return callback(null, res);
  });
}


/**
 * Add job metadata to all the jobs metadata
 * Callback signature: err
 */
function addJobMetadata (name, callback) {
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
function addAllJobsMetadata (callback) {
  var i = 0;

  Job.loadAllJobsNames(function (err, names) {
    if (err) { return callback(err); }

    async.whilst(
      function () { return i < names.length; }
    , function (cb) {
        var name = names[i];
        i += 1;
        addJobMetadata(name, cb);
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
 * Initialize the application
 */
function init (callback) {
  customUtils.ensureFolderExists(config.workspace, function (err) {
    if (err) { return callback("Couldn't ensure the workspace exists"); }

    addAllJobsMetadata(function (err) {
      if (err) { return callback("Couldn't load the jobs metadata"); }
      callback();
    });
  });
}


/**
 * Returns the jobs metadata (figures ...)
 */
function getJobsMetadata () {
  return jobsMetadata;
}


module.exports.init = init;
module.exports.getJobsMetadata = getJobsMetadata;
module.exports.addJobMetadata = addJobMetadata;
module.exports.changeJobName = changeJobName;
