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

  if (values.userInput && values.userInput.editMode) {
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
    req.renderValues.userInput.currentName = job.name;
    req.renderValues.userInput.editMode = true;
    return next();
  });
}

function create(req, res, next) {
  var values = req.renderValues || {}
    , errors = []
    , isInEditMode = req.body.editMode.toString() === 'true'
    , currentName = req.body.currentName
    ;

  req.body.editMode = isInEditMode;
  //delete req.body.currentName;
  errors = Job.validate(req.body);
  if (errors) {
    validation.prepareErrorsForDisplay(req, errors, req.body);
    return displayForm(req, res, next);
  }

  if (isInEditMode) {
    Job.getJob(currentName, function (err, job) {
      job.edit(req.body, function () {
        if (err) {
          validation.prepareErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
          return displayForm(req, res, next);
        }

        res.redirect(302, '/jobs/' + req.body.name);
      });
    });
  } else {
    Job.createJob(req.body, function (err) {
      if (err) {
        validation.prepareErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
        return displayForm(req, res, next);
      }

      return res.redirect(302, '/jobs/' + req.body.name);
    });
  }
}

// Interface
module.exports.populateFormForEdition = populateFormForEdition;
module.exports.displayForm = displayForm;
module.exports.create = create;
