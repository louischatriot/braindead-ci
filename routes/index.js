/**
 * Homepage
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , app = require('../app')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/index}}' }
    , dashboardData = []
    , jobsMetadata = app.getJobsMetadata()
    ;

  req.renderValues.jobsNames.forEach(function (name) {
    var jobData = jobsMetadata[name];
    jobData.name = name;
    dashboardData.push(jobData);
  });

  values.dashboardData = dashboardData;

  return res.render('layout', { values: values
                              , partials: partials
                              });
};
