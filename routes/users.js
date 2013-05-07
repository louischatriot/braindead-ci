var User = require('../lib/user')
  , _ = require('underscore')
  ;

function showAll (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/usersShowAll}}' }
    ;

  return res.render('layout', { values: values
                              , partials: partials
                              });
}


function createOne (req, res, next) {

}

/**
 * User onboarding
 */
function firstTimeDisplayForm (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/firstUserCreation}}' }
    ;

  return res.render('layout', { values: values
                              , partials: partials
                              });
}

function firstTimeUserCreation (req, res, next) {
  var userData = { login: req.body.login, password: req.body.password }

  User.createUser(userData, function (err, user) {
    if (err) {
      if (err.validationErrors) {
        req.renderValues.userInput = userData;
        req.renderValues.validationErrors = true;
        req.renderValues.errors = _.values(err.validationErrors);
        return firstTimeDisplayForm(req, res, next);
      } else {
        return res.send(500);
      }
    }

    req.session.userId = user._id;
    res.redirect(302, '/');
  });
}


// Interface
module.exports.showAll = showAll;
module.exports.createOne = createOne;
module.exports.firstTime = { displayForm: firstTimeDisplayForm
                           , userCreation: firstTimeUserCreation
                           };
