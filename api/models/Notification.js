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
    console.log('--->send commet',notification);
    cb();
  },

};
