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

  return res.render('layout', { values: values
                              , partials: partials
                              });
}

function create(req, res, next) {
  var values = req.renderValues || {}
    , errors = []
    ;

  errors = validation.validate('job', req.body);
  if (errors) {
    validation.saveErrorsForDisplay(req, errors, req.body);
    return displayForm(req, res, next);
  }

  Job.createJob(req.body, function (err) {
    if (err) {
      validation.saveErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
      return displayForm(req, res, next);
    }

    res.redirect(302, '/jobs/' + req.body.name);
  });
}

// Interface
module.exports.displayForm = displayForm;
module.exports.create = create;
