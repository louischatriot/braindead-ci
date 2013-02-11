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

    console.log(req.body);

    console.log("====");
    console.log(customUtils.validate('job', req.body));

    res.redirect(302, '/jobs/new');

}

// Interface
module.exports.displayForm = displayForm;
module.exports.create = create;
