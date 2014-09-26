module.exports = function(req, res, next) {

  // The dev team gets this by default.
  var codeandoMexico = {
    'vrrdo': 1,
    'juanpabloe': 1,
    'paulinabustosa': 1,
  }
  if (codeandoMexico[req.session.user.twitterScreenName.toLowerCase()] == 1) {
    return next();
  }

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
