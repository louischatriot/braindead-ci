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


module.exports.launchBuild = function (req, res, next) {

};
