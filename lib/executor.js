/**
 * Responsible for queuing and executing builds
 * Also, the name is kinda cool. Like some bad guy in a movie.
 * This ensures at most one build is executed at any given time
 */

var buildsQueue = []
  , Job = require('./job')
  , Stream = require('stream')
  , currentJob = null
  , logStream
  ;


/**
 * Register a new build for job 'name' at the end of the execution queue
 */
function registerBuild (name) {
  buildsQueue.push(name);

  if (!currentJob) {
    launchNextQueuedBuild();
  }
}


/**
 * Launch the next queued build
 */
function launchNextQueuedBuild () {
  if (buildsQueue.length === 0) {
    currentJob = null;
  } else {
    Job.getJob(buildsQueue.shift(), function (err, job) {
      // In some edge cases (job was renamed after build was scheduled), the job can be not found
      // In that case, simply launch the next build
      if (err || !job) { return launchNextQueuedBuild(); }

      currentJob = {};
      currentJob.name = job.name;
      currentJob.buildNumber = job.nextBuildNumber;
      currentJob.log = "";

      logStream = new Stream();
      logStream.writable = true;
      logStream.write = function (data) {
        currentJob.log += data;
        return true;
      };

      job.build(logStream, launchNextQueuedBuild);
    });
  }
}


/**
 * Get info about the state of the executor
 */
function getQueueState () { return buildsQueue; }
function getCurrentJob() { return currentJob; }

function isABuildQueued(name) {
  if (buildsQueue.indexOf(name) === -1) {
    return false;
  } else {
    return true;
  }
}


module.exports.registerBuild = registerBuild;
module.exports.getCurrentJob = getCurrentJob;
module.exports.isABuildQueued = isABuildQueued;
module.exports.getQueueState = getQueueState;
