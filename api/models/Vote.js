/**
 * Vote.js
 *
 * Intermediary model.
 * http://sailsjs.org/#/documentation/concepts/ORM/Associations/ThroughAssociations.html
 * 
 */

module.exports = {
  attributes: {
    user: {
      model: 'user'
    },
    annotation: {
      model: 'annotation'
    },
    value: {
      type: 'INTEGER',
      enum: [-1, +1]
    },
  },

  afterCreate: function(new_vote, cb) {
    Annotation.findOne({id: new_vote.annotation})
    .exec(function(err, annotation) {
      var metadata = new_vote.value > 0 ? ['positivo', 'vote_up'] : ['negativo', 'vote_down'];
      Notification.create({
        text: 'Recibiste un voto ' + metadata[0] + ' <a href="#">aquí</a>',
        type: metadata[1],
        belongs_to: annotation.user,
        triggered_by: new_vote.user
      }).exec(function(err, notification) {
        cb();
      });
    });
  },


  afterUpdate: function(updated_vote, cb) {
    Annotation.findOne({id: updated_vote.annotation})
    .exec(function(err, annotation) {
      var metadata = updated_vote.value > 0 ? ['positivo', 'vote_up'] : ['negativo', 'vote_down'];
      Notification.create({
        text: 'Recibiste un voto ' + metadata[0] + ' <a href="#">aquí</a>',
        type: metadata[1],
        belongs_to: annotation.user,
        triggered_by: updated_vote.user
      }).exec(function(err, notification) {
        cb();
      });
    });
  },
};
