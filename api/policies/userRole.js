module.exports = function(req, res, next) {
  // The user role is what everybody gets when they log in.
  // Experts and Admins are also considered as "Users" by the backend.
  if (req.session.user && (req.session.user.role == 'user' || req.session.user.role == 'expert' || req.session.user.role == 'admin')) {
    return next();
  } else {
    res.locals.layout = false;
    return res.view('403');
  }
};
