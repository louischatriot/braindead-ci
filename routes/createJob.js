/**
 * Create a new job
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , customUtils = require('../lib/customUtils')
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

  errors = customUtils.validate('job', req.body);
  if (errors) {
    customUtils.saveErrorsForDisplay(req, errors, req.body);
    return displayForm(req, res, next);
  }

  Job.createJob(req.body, function (err) {
    if (err) {
      customUtils.saveErrorsForDisplay(req, ['Something strange happened, please try again'], req.body);
      return displayForm(req, res, next);
    }

    res.redirect(302, '/jobs/' + req.body.name);
  });
}

// Interface
module.exports.displayForm = displayForm;
module.exports.create = create;
