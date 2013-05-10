/**
 * Create a new job
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , validation = require('../lib/validation')
  , customUtils = require('../lib/customUtils')
  , moment = require('moment')
  ;

/**
 * Display all information about a job, its configuration, build results and enabled state
 */
function homepage (req, res, next) {
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

    values.taskManagerOnly = false;
    if (!job.repoSSHUrl || job.repoSSHUrl.length === 0) { values.taskManagerOnly = true; }
    if (!job.branch || job.branch.length === 0) { values.taskManagerOnly = true; }

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
}


function displayForm (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/createJob}}' }
    ;

  if (values.editMode) {
    values.title = "Edit job " + values.userInput.name;
  } else {
    values.title = "Create a new job";
  }

  return res.render('layout', { values: values
                              , partials: partials
                              });
}


function populateFormForEdition (req, res, next) {
  Job.getJob(req.params.name, function (err, job) {
    req.renderValues.userInput = job;
    req.renderValues.currentName = job.name;
    req.renderValues.editMode = true;
    return next();
  });
}


function create (req, res, next) {
  var values = req.renderValues || {}
    , errors = []
    ;

  Job.createJob(req.body, function (err) {
    if (err) {
      values.validationErrors = true;
      values.errors = err.validationErrors;
      values.userInput = req.body;
      return displayForm(req, res, next);
    }

    return res.redirect(302, '/jobs/' + req.body.name);
  });
}


function edit (req, res, next) {
  var values = req.renderValues || {}
    , errors = []
    , currentName = req.body.currentName
    ;

  values.editMode = true;
  values.currentName = currentName;

  Job.getJob(currentName, function (err, job) {
    job.edit(req.body, function (err) {
      if (err) {
        if (err.validationErrors) {
          values.validationErrors = true;
          values.errors = err.validationErrors;
          values.userInput = req.body;
        } else {
          validation.prepareErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
        }

        return displayForm(req, res, next);
      }

      res.redirect(302, '/jobs/' + req.body.name);
    });
  });
}


// Interface
module.exports.homepage = homepage;
module.exports.populateFormForEdition = populateFormForEdition;
module.exports.displayForm = displayForm;
module.exports.create = create;
module.exports.edit = edit;
