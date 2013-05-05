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
    var jobsNames = _.pluck(jobs, 'name');
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
    jobsNames.forEach(function (name) {
      if (jobs[name].githubRepoUrl === receivedGithubRepoUrl && jobs[name].branch === receivedBranch) {
        if (jobs[name].enabled) {
          executor.registerBuild(name);
        } else {
          disabledMessage.message = name + " was not built since it's in disabled state";
          customUtils.sendMessageToHipchat(disabledMessage);
        }
      }
    });

    return res.send(200);   // Always return a success
  });
};
