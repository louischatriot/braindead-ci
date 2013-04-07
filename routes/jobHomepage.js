/**
 * Display a job's homepage, showing basic info
 * And launching builds
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , customUtils = require('../lib/customUtils')
  , moment = require('moment')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/jobHomepage}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    values.job = job;
    values.job.numberOfBuilds = job.nextBuildNumber - 1;
    values.job.previousBuilds = customUtils.objectToArrayInOrder(job.previousBuilds);
    values.job.previousBuilds.sort(function (a, b) { return (new Date(b.date)).getTime() - (new Date(a.date)).getTime(); });

    values.job.previousBuilds.forEach(function (build) {
      build.date = moment(build.date).format('MMMM Do YYYY HH:mm:ss');
    });

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
}

