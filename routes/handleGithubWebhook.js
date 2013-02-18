/**
 * Handle payloads received from Github and
 * launch the corresponding build if necessary
 */

var app = require('../app')
  , Job = require('../lib/job')
  , executor = require('../lib/executor')
  ;


module.exports = function (req, res, next) {
  var jobsMetadata = app.getJobsMetadata()
    , jobs = Object.keys(jobsMetadata)
    , payload = JSON.parse(req.body.payload)
    , receivedGithubRepoUrl = payload.repository.url
    , receivedBranch = payload.ref.replace(/^.*\//,'')
    , jobToBuild;

  // Build all jobs corresponding using the repo and branch of this push
  jobs.forEach(function (name) {
    if (jobsMetadata[name].githubRepoUrl === receivedGithubRepoUrl && jobsMetadata[name].branch === receivedBranch) {
      executor.registerBuild(name);
    }
  });

  return res.send(200);   // Always return a success
};
