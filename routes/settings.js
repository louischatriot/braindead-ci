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
    if (err) { return next(); }   // Shouldn't happen anyway

    return next();
  });
}


// Interface
module.exports.displayForm = displayForm;
module.exports.update = update;
