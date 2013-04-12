/**
 * Handle payloads received from Github and
 * launch the corresponding build if necessary
 */

var app = require('../app')
  , Job = require('../lib/job')
  , executor = require('../lib/executor')
  , customUtils = require('../lib/customUtils')
  ;


module.exports = function (req, res, next) {
  var jobsMetadata = app.getJobsMetadata()
    , jobs = Object.keys(jobsMetadata)
    , payload = JSON.parse(req.body.payload)
    , receivedGithubRepoUrl = payload.repository.url
    , receivedBranch = payload.ref.replace(/^.*\//,'')
    , disabledMessage = { room_id: 'Deployment'
                        , from: 'Braindead CI'
                        , message_format: 'html'
                        , notify: 0
                        , color: 'gray'
                        }
    ;

  // Build all the enabled jobs corresponding using the repo and branch of this push
  jobs.forEach(function (name) {
    if (jobsMetadata[name].githubRepoUrl === receivedGithubRepoUrl && jobsMetadata[name].branch === receivedBranch) {
      if (jobsMetadata[name].enabled) {
        executor.registerBuild(name);
      } else {
        disabledMessage.message = name + " was not built since it's in disabled state";
        customUtils.sendMessageToHipchat(disabledMessage);
      }
    }
  });

  return res.send(200);   // Always return a success
};
