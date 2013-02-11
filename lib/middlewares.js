/**
 * Custom middlewares
 */

var Job = require('./job');

module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = {};

  Job.loadAllJobsNames(function (err, jobsNames) {
    req.renderValues.jobsNames = jobsNames;
    return next();
  });
};
