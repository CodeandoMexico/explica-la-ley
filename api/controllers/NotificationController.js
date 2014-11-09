/**
 * NotificationController.js
 *
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @: ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  return res.redirect('/');
}

module.exports = {

  find: function(req, res) {
    Notification.find({
      belongs_to: req.session.user.id,
      sort: 'createdAt DESC'
    })
    .paginate({page: req.param('page') || 1, limit: 7})
    .exec(function(err, notifications) {
      if (err) return _error(err, req, res);
      var response = {
        notifications : notifications,
        page          : req.param('page') || 1,
        more_pages    : notifications.length == 7
      };
      res.locals.layout = 'layoutv2-full-width';
      return res.view(response);
    });
  },

};
