/**
 * Homepage
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/index}}' }
    ;

  return res.render('layout', { values: values
                              , partials: partials
                              });
};
