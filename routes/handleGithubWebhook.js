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
  db.jobs.find({}, function (err, jobs) {
    var payload = JSON.parse(req.body.payload)
      , receivedGithubRepoUrl = payload.repository.url
      , receivedBranch = payload.ref.replace(/^.*\//,'')
      ;

    // Build all the enabled jobs corresponding using the repo and branch of this push
    jobs.forEach(function (job) {
      if (job.githubRepoUrl === receivedGithubRepoUrl && job.branch === receivedBranch) {
        if (job.enabled) {
          executor.registerBuild(job.name);
        } else {
          job.advertiseOnHipchat(null);
        }
      }
    });

    return res.send(200);   // Always return a success
  });
};
