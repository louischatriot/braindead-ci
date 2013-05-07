var db = require('../lib/db');

function displayForm (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/login}}' }

  values.userInput = values.userInput || {};
  //req.session.userId = "RJ4V6xZDDphMwcZQ";

  return res.render('layout', { values: values
                              , partials: partials
                              });
}


function checkCredentials (req, res, next) {
  if (! req.body.login) { return res.send(401); }

  db.users.findOne({ login: req.body.login }, function (err, user) {
    if (err || !user || user.password !== req.body.password) {
      req.renderValues.userInput = { login: req.body.login, password: req.body.password };
      return displayForm(req, res, next);
    }

    req.session.userId = user._id;
    return res.redirect(302, '/');
  });
}



// Interface
module.exports.displayForm = displayForm;
module.exports.checkCredentials = checkCredentials;
