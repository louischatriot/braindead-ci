/**
 * Custom middlewares
 */

var Job = require('./job')
  , app = require('../app');

module.exports.commonRenderValues = function (req, res, next) {
  var jobsMetadata = app.getJobsMetadata();

  req.renderValues = {};
  req.renderValues.jobsNames = Object.keys(jobsMetadata);
  return next();
};
