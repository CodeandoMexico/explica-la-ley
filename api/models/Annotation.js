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
      if (annotations.length == 0) cb();

      var ranges = new_annotation.ranges;
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
          // Get the authors of the touched annotations (who will be getting a
          // notification). Do not repeat their IDs (the new annotation can touch
          // several old annotations from a same author -- however, that author
          // must only get ONE notification).
          var uniq_authors_touched_annotations = _.uniq(_.pluck(touched_annotations, 'user'));
          if (uniq_authors_touched_annotations.length == 0) cb();

          for (j in uniq_authors_touched_annotations) {
            Notification.create({
              article      : new_annotation.article,
              type         : 'reply',
              belongs_to   : uniq_authors_touched_annotations[j],
              triggered_by : new_annotation.user
            }).exec(function(err, notification) {
              if (j == uniq_authors_touched_annotations.length - 1) {
                cb();
              }
            });

          }
        }

      }
    });
  },

};
