/**
 * Homepage
 */


var config = require('../lib/config')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/index}}' }
    ;

  return res.render('layout', { values: values
                              , partials: partials
                              });

};
