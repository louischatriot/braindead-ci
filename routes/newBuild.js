/**
 * Launch a new build
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , executor = require('../lib/executor')
  ;

module.exports.webpage = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/newBuild}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    values.job = job;
    executor.registerBuild(job.name);

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
};


module.exports.currentBuild = function (req, res, next) {
  if (executor.isABuildQueued(req.params.name)) {
    var currentJob = executor.getCurrentJob();
    if (req.params.name === currentJob.name) {
      return res.json(200, currentJob);
    } else {
      return res.json(201, { message: 'Build scheduled' });
    }
  } else {
    return res.json(404, { message: 'This job has no build queued' });
  }
};
