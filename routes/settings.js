module.exports = function (req, res, next) {
  var values = req.renderValues
    , partials = { content: '{{>pages/settings}}' }
    ;

  return res.render('layout', { values: values
                              , partials: partials
                              });
};
