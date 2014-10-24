module.exports = function(req, res, next) {

  // Expert users have the same privileges as normal users. However, their role
  // (particularly the string 'expert' in the user object), will be used to add
  // special visual effects GUI-wise when they write annotations.
  // Admins are also considered as "Experts" by the backend.
  if (req.session.user && (req.session.user.role == 'expert' || req.session.user.role == 'admin')) {
    return next();
  } else {
    return res.send('You are not permitted to perform this action.', 403);
  }

};
