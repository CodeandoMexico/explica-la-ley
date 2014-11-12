/**
 * Notification.js
 *
 * This is the ugliest model of all.
 * It does not fall under the "third normal form" category.
 * It should be related only to the Annotation model, since the flow goes like
 * Annotaion -> Article -> Law -> Tag. But associating it with an Article makes
 * my life easier :^)
 */

module.exports = {

  attributes: {
    article: {
      model: 'article'
    },
    seen: {
      type: 'boolean',
      defaultsTo: false
    },
    type: {
      type: 'STRING',
      enum: ['vote_down', 'vote_up', 'reply']
    },
    belongs_to: {
      model: 'user'
    },
    triggered_by: {
      model: 'user'
    },
  },

  // Get the room of the owning user and alert him/her of this new notification.
  afterCreate: function(notification, cb) {
    var notification_owner = sails.sockets.subscribers(notification.belongs_to);
    sails.sockets.emit(notification_owner, 'new', notification);
    cb();
  },

  // Query the DB directly for this number. This is done to improve performance.
  // There's no need for more info on these notifications.
  getUnseenCountFromUser: function(user_id, next) {
    Notification.query({
      text: 'SELECT COUNT(*) FROM notification WHERE belongs_to = $1 AND seen = false',
      values: [user_id],
    }, function(err, result) {
      if (err) console.log(err);
      if (typeof result === 'undefined' || typeof result.rows === 'undefined') {
        next(0);
      } else {
        next(result.rows[0]);
      }
    });
  },

};
