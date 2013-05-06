/**
 * Custom middlewares
 */

var Job = require('./job')
  , executor = require('./executor')
  , db = require('./db')
  , _ = require('underscore')
  , settings = require('../routes/settings')
  ;

/**
 * Serve favicon so that calls to /favicon.ico don't pollute the rest of the app
 * esp. sessions (thank you, Express)
 */
module.exports.serveFavicon = function (req, res, next) {
  if (req.url === '/favicon.ico') {
    return res.send(404);   // I will change this once I have a logo for Braindead
  } else {
    return next();
  }
};


/**
 * Values needed to render all pages
 */
module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = req.renderValues || {};

  req.renderValues.currentJobName = executor.getCurrentJob() && executor.getCurrentJob().name;
  req.renderValues.idle = req.renderValues.currentJobName === undefined || req.renderValues.currentJobName === null;
  req.renderValues.queuedJobs = executor.getQueueState();
  req.renderValues.someJobsQueued = req.renderValues.queuedJobs.length > 0;

  db.jobs.find({}, function (err, jobs) {
    req.renderValues.jobsNames = _.pluck(jobs, 'name');
    return next();
  });
};


/**
 * Check if it this is the first time we run
 * If it is, display the settings page
 */
module.exports.checkFirstTimeUse = function (req, res, next) {
  req.renderValues = req.renderValues || {};

  // Don't block POST requests
  if (req.route.method !== 'get') { return next(); }

  db.settings.findOne({ type: 'generalSettings' }, function (err, generalSettings) {
    if (err) { return res.send(500,err); }

    if (!generalSettings || generalSettings.hipchatToken === undefined || generalSettings.githubToken === undefined || generalSettings.hipchatRoom === undefined) {
      req.renderValues.firstTimeUse = true;
      return settings.displayForm(req, res, next);
    } else {
      return next();
    }
  });
};


