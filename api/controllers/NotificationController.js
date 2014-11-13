/**
 * NotificationController.js
 *
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @ ' + req.options.controller + '/' + req.options.action);
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

      // Simulate multi-level populate() (unsupported by sails ATM).
      var article_ids = _.uniq(_.pluck(notifications, 'article'));
      Article.find({id: article_ids}).exec(function(err, articles) {
        if (err) return _error(err, req, res);
        var law_ids = _.uniq(_.pluck(articles, 'law'));
        Law.find({id: law_ids}).exec(function(err, laws) {
          if (err) return _error(err, req, res);
          var tag_ids = _.uniq(_.pluck(laws, 'tag'));
          Tag.find({id: tag_ids}).exec(function(err, tags) {

            // Now we have the relevant "articles", "laws", and "tags" with
            // just 3 queries. We can make our notifications more verbose.
            // Leave this task to the EJS views (associate a notification with
            // an article, law, and tag for informational purposes).

            // Check if any of the next pages has unseen notifications. Use the
            // "has_unseen" variable to paint the "next page" button green.

            Notification.find({
              skip  : parseInt(req.param('page') || 1) * notifications_per_page,
              where : {seen: false, belongs_to: req.session.user.id}
            }).exec(function(err, unseen_notifications) {
              if (err) return _error(err, req, res);
              var response = {
                notifications : notifications,
                page          : req.param('page') || 1,
                more_pages    : notifications.length == notifications_per_page,
                has_unseen    : unseen_notifications.length > 0,
                articles      : articles,
                laws          : laws,
                tags          : tags
              };
              res.locals.layout = 'layoutv2-full-width';
              return res.view(response);
            });
          });
        });
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

  getUnseenCountJson: function(req, res) {
    Notification.getUnseenCountFromUser(req.session.user.id, function(count) {
      return res.json(count);
    });
  },

  markAsSeen: function(req, res) {
    Notification.update({
      id: req.param('notifications')
    }, {
      seen: true
    }).exec(function(err, notifications) {
      if (err) return _error(err, req, res);
      return res.send(200);
    });
  },

};
