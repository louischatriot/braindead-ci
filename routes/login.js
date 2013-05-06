module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/login}}' }

  req.session.userId = "RJ4V6xZDDphMwcZQ";

  return res.render('layout', { values: values
                              , partials: partials
                              });
};
