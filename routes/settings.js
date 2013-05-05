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


}


// Interface
module.exports.displayForm = displayForm;
module.exports.update = update;
