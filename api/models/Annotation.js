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
    // Get all anotations inside this article that are not owned by this new
    // annotation's author.
    Annotation.find({
      article: new_annotation.article,
      user: { '!': new_annotation.user }
    })
    .exec(function(err, annotations) {

      // No need need to send notifications if no one else has annotated this
      // article.
      if (annotations.length == 0) cb();

      // Check whether this is a string or an array. There's a bug somewhere
      // that makes this unpredictable.
      var ranges = typeof new_annotation.ranges === 'string' ? JSON.parse(new_annotation.ranges) : new_annotation.ranges;
      var start = ranges[0].startOffset;
      var end = ranges[0].endOffset;
      var touched_annotations = [];

      for (i in annotations) {

        var ranges2 = annotations[i].ranges;
        var start2 = ranges2[0].startOffset;
        var end2 = ranges2[0].endOffset;

        // Save a reference to the annotations that were touched by this new
        // one.
        if (start2 <= end || end2 >= start) {
          touched_annotations.push(annotations[i]);
        }

        if (i == annotations.length - 1) {

          // If this new annotation didn't touch existing ones, there's no
          // need to send notifications.
          if (touched_annotations.length == 0) {
            cb();
          }

          // Get the authors of the touched annotations (who will be getting a
          // notification). Do not repeat their IDs (the new annotation can touch
          // several old annotations from a same author -- however, that author
          // must only get ONE notification).
          var uniq_authors_touched_annotations = _.uniq(_.pluck(touched_annotations, 'user'));

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
