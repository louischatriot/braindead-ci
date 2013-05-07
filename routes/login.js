var db = require('../lib/db')
  , User = require('../lib/user')
  , _ = require('underscore')
  ;

function displayForm (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/login}}' }

  values.userInput = values.userInput || {};

  return res.render('layout', { values: values
                              , partials: partials
                              });
}


function checkCredentials (req, res, next) {
  req.renderValues.userInput = { login: req.body.login, password: req.body.password };

  if (!req.body.login) {
    req.renderValues.validationErrors = true;
    req.renderValues.errors = ['Please enter a login'];
    return displayForm(req, res, next);
  }

  if (!req.body.password) {
    req.renderValues.validationErrors = true;
    req.renderValues.errors = ['Please enter your password'];
    return displayForm(req, res, next);
  }

  User.checkCredentials(req.body.login, req.body.password, function (err, user) {
    if (err) {
      if (err.validationErrors) {
        req.renderValues.validationErrors = true;
        req.renderValues.errors = _.values(err.validationErrors);
      }
      return displayForm(req, res, next);
    }

    req.session.userId = user._id;
    return res.redirect(302, '/');
  });
}



// Interface
module.exports.displayForm = displayForm;
module.exports.checkCredentials = checkCredentials;
