module.exports = function(req, res, next) {

  // Admin users have all the privileged normal and expert users have.
  if (req.session.user && req.session.user.role == 'admin') {
    return next();
  } else {
    res.locals.layout = false;
    return res.view('403');
  }

};
