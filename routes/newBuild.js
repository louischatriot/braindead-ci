/**
 * Launch a new build
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  ;

module.exports.webpage = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/newBuild}}' }
    ;

  Job.getJob(req.params.name, function (err, job) {
    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
};


module.exports.launchBuild = function (req, res, next) {
  res.writeHead(200);
  Job.getJob('mongo-edit', function (err, job) {
    job.build(res, function (err) {
      res.write("========= DONE ===\n");
      if (err) {
        res.write("There was an error");
      } else {
        res.write("Yay, build completed without errors");
      }
      res.end();
    });
  });
};
