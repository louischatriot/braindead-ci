/**
 * Custom middlewares
 */

var Job = require('./job')
  , app = require('../app')
  , executor = require('./executor')
  ;

module.exports.commonRenderValues = function (req, res, next) {
  var jobsMetadata = app.getJobsMetadata();

  req.renderValues = {};
  req.renderValues.jobsNames = Object.keys(jobsMetadata);
  req.renderValues.currentJobName = executor.getCurrentJob().name;
  req.renderValues.idle = req.renderValues.currentJobName === undefined;
  req.renderValues.queuedJobs = executor.getQueueState();
  req.renderValues.someJobsQueued = req.renderValues.queuedJobs.length > 0;

  return next();
};
