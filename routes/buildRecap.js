/**
 * Display a recap of this build
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/buildRecap}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    values.job = job;

    job.getBuild(req.params.buildNumber, function (err, buildData) {
      values.build = buildData;

      return res.render('layout', { values: values
                                  , partials: partials
                                  });
    });
  });
}


