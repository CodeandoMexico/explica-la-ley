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
    var notifications_per_page = 7;

    // This page's notifications.
    Notification.find({
      belongs_to: req.session.user.id,
      sort: 'createdAt DESC'
    })
    .paginate({page: req.param('page') || 1, limit: notifications_per_page})
    .exec(function(err, notifications) {
      if (err) return _error(err, req, res);

      // Check if any of the next pages has unseen notifications.
      Notification.find({
        skip  : parseInt(req.param('page') || 1) * notifications_per_page,
        where : {seen: false}
      }).exec(function(err, unseen_notifications) {
        if (err) return _error(err, req, res);
        var response = {
          notifications : notifications,
          page          : req.param('page') || 1,
          more_pages    : notifications.length == notifications_per_page,
          has_unseen    : unseen_notifications.length > 0
        };
        res.locals.layout = 'layoutv2-full-width';
        return res.view(response);
      });
    });
  },

  liveUpdates: function(req, res) {
    if (req.isSocket) {
      // Create a room named after the user's ID for each user, so they only
      // get to see the notifications that belong to them.
      sails.sockets.join(req.socket, req.session.user.id);
      Notification.watch(req);
    }
  },

  getUnseenJson: function(req, res) {
    Notification.getUnseenFromUser(req.session.user.id, function(count) {
      return res.json(count);
    });
  }

};
