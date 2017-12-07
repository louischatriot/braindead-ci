/**
 * Handle payloads received from Github and
 * launch the corresponding build if necessary
 */

var Job = require('../lib/job')
  , executor = require('../lib/executor')
  , customUtils = require('../lib/customUtils')
  , db = require('../lib/db')
  , _ = require('underscore')
  ;


module.exports = function (req, res, next) {
  db.settings.findOne({ type: 'generalSettings' }, function (err, settings) {
    if (req.query.token === undefined || req.query.token.length === 0 || req.query.token !== settings.githubToken) { return res.send(200); } 

    db.jobs.find({}, function (err, jobs) {
      var receivedGithubRepoUrl = req.body.repository.html_url;

      // Build all the enabled jobs corresponding to this repo (all jobs for all branches)
      jobs.forEach(function (job) {
        if (job.githubRepoUrl === receivedGithubRepoUrl) {
          if (job.enabled) {
            executor.registerBuild(job.name);
          } else {
            Job.getJob(job.name, function (err, job) {
              if (err || !job) { return; }
              job.advertiseBuildResult(null);
            });
          }
        }
      });

      return res.send(200);   // Always return a success
    });
  });
};

