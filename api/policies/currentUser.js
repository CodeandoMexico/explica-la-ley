/**
 * Gets the current user from a session, or returns 403
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to controller
  if (req.session.user && req.session.user.id) {
    return next();
  }
  // User is not allowed
  else {
    return res.send('You are not permitted to perform this action.', 403);
  }
};
