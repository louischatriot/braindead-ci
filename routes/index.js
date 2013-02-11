/**
 * Homepage
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/index}}' }
    ;

var testJob = { name: 'api'
              , repo: 'git@github.com:tldrio/tldr-api.git'
              , branch: 'master'
              };


Job.getJob(testJob, function (err, job) {
  //job.pullRepo(function (err) {
    //console.log("REPO PULLED");
    //console.log(err);

    //job.reinstallDependencies(function () {
      //console.log("REINSTALLED");

      job.runTests([res, process.stdout], function (err) {
        console.log("TEST RESULT");
        console.log(err);
      });
    //});
  //});
});


  //return res.render('layout', { values: values
                              //, partials: partials
                              //});

};
