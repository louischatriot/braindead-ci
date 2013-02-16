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
  buildsQueue.push(name);

  console.log("--------------");
  console.log("--------------");
  console.log("Queue state");
  console.log(buildsQueue);

  if (! currentlyBuilding) {
    currentlyBuilding = true;
    launchNextQueuedBuild();
  }
}


function launchNextQueuedBuild () {
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
      logStream.on('data', function (data) { currentJobInfo.log += data; });

      job.build(null, function (err) {
        launchNextQueuedBuild();
      });
    });
  }
}


function getCurrentJob() {
  return currentJobInfo;
}


module.exports.registerBuild = registerBuild;
module.exports.getCurrentJob = getCurrentJob;
