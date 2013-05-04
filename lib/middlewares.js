/**
 * Custom middlewares
 */

var Job = require('./job')
  , executor = require('./executor')
  , db = require('./db')
  , _ = require('underscore')
  ;

module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = {};

  req.renderValues.currentJobName = executor.getCurrentJob() && executor.getCurrentJob().name;
  req.renderValues.idle = req.renderValues.currentJobName === undefined || req.renderValues.currentJobName === null;
  req.renderValues.queuedJobs = executor.getQueueState();
  req.renderValues.someJobsQueued = req.renderValues.queuedJobs.length > 0;

  db.jobs.find({}, function (err, jobs) {
    req.renderValues.jobsNames = _.pluck(jobs, 'name');
    return next();
  });
};
