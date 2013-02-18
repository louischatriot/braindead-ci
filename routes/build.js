/**
 * Launch a new build or show a previous one
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , executor = require('../lib/executor')
  ;

function newBuildWebpage (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/newBuild}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    values.job = job;
    executor.registerBuild(job.name);

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
};


function buildLog (req, res, next) {
  Job.getJob(req.params.name, function (err, job) {
    job.getBuild(req.params.buildNumber, function (err, buildData) {
      if (!err) { return res.json(200, { log: buildData.log }); }
      var currentJob = executor.getCurrentJob();

      if (req.params.name === currentJob.name && parseInt(req.params.buildNumber, 10) === currentJob.buildNumber) {
        return res.json(206, { log: currentJob.log });
      }

      if (executor.isABuildQueued(req.params.name)) {   // We're lying a bit here but this case shouldn't happen
        return res.json(201, { message: 'Build scheduled' });
      } else {
        return res.json(404, { message: 'This job has no build for this number, and no queued' });
      }
    });
  });
}


function buildRecap (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/buildRecap}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    values.job = job;

    job.getBuild(req.params.buildNumber, function (err, buildData) {
      // If build can't be found, it means it hasnt completed yet but is scheduled
      if (err) { return currentBuild(req, res, next); }

      values.build = buildData;

      return res.render('layout', { values: values
                                  , partials: partials
                                  });
    });
  });
}


module.exports.buildRecap = buildRecap;
module.exports.newBuildWebpage = newBuildWebpage;
module.exports.buildLog = buildLog;
