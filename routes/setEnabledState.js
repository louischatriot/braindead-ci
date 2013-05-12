var Job = require('../lib/job');

module.exports.enableJob = function (req, res, next) {
  Job.getJob(req.params.name, function (err, job) {
    if (err || !job) { return res.send(400); }   // Shouldn't happen anyway

    job.setEnabledValue(true, function () {
      return res.send(200);
    });
  });
};


module.exports.disableJob = function (req, res, next) {
  Job.getJob(req.params.name, function (err, job) {
    if (err || !job) { return res.send(400); }   // Shouldn't happen anyway

    job.setEnabledValue(false, function () {
      return res.send(200);
    });
  });
};
