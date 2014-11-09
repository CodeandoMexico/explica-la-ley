/**
 * Notification.js
 *
 */

module.exports = {

  attributes: {
    text: 'STRING',
    seen: {
      type: 'boolean',
      defaultsTo: false
    },
    type: {
      type: 'STRING',
      enum: ['vote_down', 'vote_up', 'info']
    },
    belongs_to: {
      model: 'user'
    },
    triggered_by: {
      model: 'user'
    },
  },

  afterCreate: function(notification, cb) {
    // Get the room of the owning user and notify him/her.
    var notification_owner = sails.sockets.subscribers(notification.belongs_to)[0];
    sails.sockets.emit(notification_owner, 'new', notification);
    cb();
  },

};
