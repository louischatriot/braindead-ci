/**
 * Responsible for queuing and executing builds
 * Also, the name is kinda cool. Like some bad guy in a movie.
 * This ensures at most one build is executed at any given time
 */

var buildsQueue = []
  , Job = require('./job')
  , currentlyBuilding = false
  , Stream = require('stream')
  , currentJobInfo = {}
  , logStream
  ;


function registerBuild (name) {
  console.log("========== Register");
  console.log(name);
  buildsQueue.push(name);

  if (! currentlyBuilding) {
    currentlyBuilding = true;
    launchNextQueuedBuild();
  }
}

function getQueueState () {
  return buildsQueue;
}

function launchNextQueuedBuild () {
  console.log("==== Launch next build");
  console.log(buildsQueue);

  if (buildsQueue.length === 0) {
    currentlyBuilding = false;
    currentJobInfo = {};
  } else {
    currentlyBuilding = true;
    Job.getJob(buildsQueue.shift(), function (err, job) {
      logStream = new Stream();
      logStream.writable = true;

      currentJobInfo = {};
      currentJobInfo.name = job.name;
      currentJobInfo.buildNumber = job.nextBuildNumber;
      currentJobInfo.log = "";
      logStream.write = function (data) {
        currentJobInfo.log += data;
        return true;
      };

      job.build(logStream, function (err) {
        console.log("FINISHED BUILDING A JOB");
        launchNextQueuedBuild();
      });
    });
  }
}


function getCurrentJob() {
  return currentJobInfo;
}


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
