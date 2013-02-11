module.exports.commonRenderValues = function (req, res, next) {
  req.renderValues = {};
  return next();
};
