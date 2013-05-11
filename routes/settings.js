/**
 * Manage settings
 */
var db = require('../lib/db');

function displayForm (req, res, next) {
  var values = req.renderValues
    , partials = { content: '{{>pages/settings}}' }
    ;

  db.settings.findOne({ type: 'generalSettings' }, function (err,settings) {
    values.settings = settings;
    values.settingsPage = true;

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
}


function update (req, res, next) {
  var newSettings = { type: 'generalSettings'
                    , githubToken: req.body.githubToken
                    , hipchatToken: req.body.hipchatToken
                    , hipchatRoom: req.body.hipchatRoom
                    };

  db.settings.update({ type: 'generalSettings' }, newSettings, { multi: false, upsert: true }, function (err) {
    if (req.body.firstTimeUse) {
      return res.redirect(302, '/');
    } else {
      req.renderValues.updateSuccessful = true;
      return displayForm(req, res, next);
    }
  });
}


// Interface
module.exports.displayForm = displayForm;
module.exports.update = update;
