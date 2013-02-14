/**
 * Create a new job
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , validation = require('../lib/validation')
  ;

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
    req.renderValues.editMode = true;
    return next();
  });
}

function create(req, res, next) {
  var values = req.renderValues || {}
    , errors = []
    , isInEditMode = req.body.editMode.toString() === 'true'
    ;

  delete req.body.editMode;
  errors = validation.validate('job', req.body);
  if (errors) {
    validation.saveErrorsForDisplay(req, errors, req.body);
    return displayForm(req, res, next);
  }

  if (isInEditMode) {
    Job.getJob(req.body.name, function (err, job) {   // Cant change the name yet oO
      job.edit(req.body, function () {
        if (err) {
          validation.saveErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
          return displayForm(req, res, next);
        }

        res.redirect(302, '/jobs/' + req.body.name);
      });
    });
  } else {
    Job.createJob(req.body, function (err) {
      if (err) {
        validation.saveErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
        return displayForm(req, res, next);
      }

      res.redirect(302, '/jobs/' + req.body.name);
    });
  }
}

// Interface
module.exports.populateFormForEdition = populateFormForEdition;
module.exports.displayForm = displayForm;
module.exports.create = create;
