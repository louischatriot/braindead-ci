/**
 * Responsible for queuing and executing builds
 * Also, the name is kinda cool. Like some bad guy in a movie.
 * This ensures at most one build is executed at any given time
 */

var buildsQueue = []
  , Job = require('./job')
  , currentlyBuilding = false
  ;


function registerBuild (name) {
  buildsQueue.push(name);

  console.log("--------------");
  console.log("--------------");
  console.log("Queue state");
  console.log(buildsQueue);


  if (! currentlyBuilding) {
    currentlyBuilding = true;
    buildsQueue.push(name);
    launchNextQueuedBuild();
  }
}


function launchNextQueuedBuild () {
  if (buildsQueue.length === 0) {
    currentlyBuilding = false;
  } else {
    currentlyBuilding = true;
    Job.getJob(buildsQueue.shift(), function (err, job) {
      job.build(null, function (err) {
        launchNextQueuedBuild();
      });
    });
  }
}


module.exports.registerBuild = registerBuild;
