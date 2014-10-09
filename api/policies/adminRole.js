module.exports = function(req, res, next) {

  // The dev team gets this by default.
  var codeandoMexico = {
    'vrrdo': 1,
    'juanpabloe': 1,
    'paulinabustosa': 1,
  }
  if (req.session.user && codeandoMexico[req.session.user.twitterScreenName.toLowerCase()] == 1) {
    return next();
  }

  // Admin users have all the privileged normal and expert users have.
  if (req.session.user && req.session.user.role == 'admin') {
    return next();
  } else {
    return res.send('You are not permitted to perform this action.', 403);
  }

};
