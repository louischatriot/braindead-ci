/**
 * Display a job's homepage, showing basic info
 * And launching builds
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , customUtils = require('../lib/customUtils')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/jobHomepage}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    values.job = job;
    values.job.numberOfBuilds = job.nextBuildNumber - 1;

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
}

