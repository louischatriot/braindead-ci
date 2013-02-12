/**
 * Handle payloads received from Github and
 * launch the corresponding build if necessary
 */

var app = require('../app')
  , Job = require('../lib/job')
  ;


module.exports = function (req, res, next) {
  var jobs = Object.keys(app.jobsMetadata)
    , payload = JSON.parse(req.body.payload)
    , receivedGithubRepoUrl = payload.repository.url
    , receivedBranch = payload;
    , jobToBuild;

    console.log("====================");
    console.log(payload);

  jobs.forEach(function (name) {
    if (app.jobsMetadata[name].githubRepoUrl === receivedGithubRepoUrl) {
      jobToBuild = name;
    }
  });

  if (jobToBuild) {
    Job.getJob(jobToBuild, function (err, job) {
      if (err) { return res.send(200); }
      job.build(null, function (err) {
        res.send(200);
      });
    });
  }
};
