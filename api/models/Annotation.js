/**
 * Annotation.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    text: 'STRING',
    quote: 'STRING',
    ranges: 'ARRAY',
    article: {
      model: 'article'
    },
    user: {
      model: 'user'
    },
    voted_by: {
      collection: 'vote',
      via: 'user',
      dominant: true
    },
  },

  afterCreate: function(new_annotation, cb) {
    Annotation.find({
      article: new_annotation.article,
      user: { '!': new_annotation.user }
    })
    .exec(function(err, annotations) {
      // XXX: Keep an eye on this line.
      // Seems like sails should have parsed this beforehand.
      // Sails might do it in future version (will crash this app).
      var ranges = JSON.parse(new_annotation.ranges);
      var start = ranges[0].startOffset;
      var end = ranges[0].endOffset;
      var touched_annotations = [];

      for (i in annotations) {

        var ranges2 = annotations[i].ranges;
        var start2 = ranges2[0].startOffset;
        var end2 = ranges2[0].endOffset;
        if (start2 <= end || end2 >= start) {
          touched_annotations.push(annotations[i]);
        }

        if (i == annotations.length - 1) {
          for (j in touched_annotations) {
            Notification.create({
              text         : 'Han respondido a uno de tus comentarios',
              type         : 'info',
              belongs_to   : touched_annotations[j].user,
              triggered_by : new_annotation.user
            }).exec(function(err, notification) {
              if (j == touched_annotations.length - 1) {
                cb();
              }
            });
          }
        }

      }
    });
  },

};
