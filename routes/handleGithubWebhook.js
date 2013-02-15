/**
 * Handle payloads received from Github and
 * launch the corresponding build if necessary
 */

var app = require('../app')
  , Job = require('../lib/job')
  ;


module.exports = function (req, res, next) {
  var jobsMetadata = app.getJobsMetadata()
    , jobs = Object.keys(jobsMetadata)
    , payload = JSON.parse(req.body.payload)
    , receivedGithubRepoUrl = payload.repository.url
    , receivedBranch = payload.ref.replace(/^.*\//,'')
    , jobToBuild;

  console.log("========================");
  console.log("========================");
  console.log("========================");
  console.log(receivedBranch);

  jobs.forEach(function (name) {
    if (jobsMetadata[name].githubRepoUrl === receivedGithubRepoUrl && jobsMetadata[name].branch === receivedBranch) {
      jobToBuild = name;
    }
  });

  if (jobToBuild) {
    Job.getJob(jobToBuild, function (err, job) {
      if (err) { return res.send(200); }
      job.build(null, function (err) {
      });
    });
  }

  return res.send(200);   // Always return a success
};
