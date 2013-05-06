module.exports = function (req, res, next) {
  delete req.session.userId;
  return res.redirect(302, '/');
};
