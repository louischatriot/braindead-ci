/**
 * Custom middlewares
 */

var Job = require('./job')
  , executor = require('./executor')
  , db = require('./db')
  , _ = require('underscore')
  , routes = require('./routes')
  , User = require('./user')
  , config = require('./config')
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
 * Populate req.user if there is a logged in user
 */
module.exports.populateLoggedInUser = function (req, res, next) {
  req.renderValues = req.renderValues || {};

  if (!req.session.userId) { return next(); }

  db.users.findOne({ _id: req.session.userId }, function (err, user) {
    req.user = user;
    req.renderValues.loggedUser = user;
    return next();
  });
}


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
    if (err) { return res.send(500, err); }
    if (!generalSettings || generalSettings.hipchatToken === undefined || generalSettings.githubToken === undefined || generalSettings.hipchatRoom === undefined) {
      req.renderValues.firstTimeUse = true;
      return routes.settings.displayForm(req, res, next);
    }

    return next();
  });
};


/**
 * Check if user is logged. If not, redirect him to the login page
 * Exceptions: if no user is already created (first launch) or if launched in "forgot password" mode
 */
module.exports.needToBeLoggedIn = function (req, res, next) {
  User.userDbEmpty(function (dbEmpty) {
    if (dbEmpty || config.forgotPassword) {
      req.renderValues.firstTimeUse = true && !config.forgotPassword;   // Don't display the "first time" message in password recovery mode
      if (req.route.method !== 'get') { return next(); }
      return routes.users.userCreationForm(req, res, next);
    }

    if (req.user) {
      return next();
    } else {
      return res.redirect(302, '/login');
    }
  });
};


/**
 * Check whether we are in "forgot password" mode so as not to display the "Create new user" screen
 */
module.exports.dontDisplayIfInForgotPasswordMode = function (req, res, next) {
  if (config.forgotPassword) {
    return res.redirect(302, '/');
  } else {
    return next();
  }
};

