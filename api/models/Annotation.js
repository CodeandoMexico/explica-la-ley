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
      collection: 'user',
      via: 'voted_for',
      dominant: true
    },
  },

 /*
  * Returns Annotation objects with their respective 'score' attribute.
  * @param {Array} annotatons: Array or Annotation objects.
  * @param {Function} next: Callback that runs when all annotations are processed.
  * @return {Array} rows: Contains the given annotations with their computed scores.
  */
  getVoteScores: function(annotations, next) {
    // No annotations means no votes.
    if (annotations.length == 0) next({});

    var dict = {}; // Key: annotation ID. Value: vote score.
    var rows = [];  // Will contain the original Annotation objects plus their score.
    var a = 0; // Number of processed annotations.

    for (i in annotations) {
      dict[annotations[i].id] = annotations[i];
      Annotation.query({
        text: 'SELECT SUM("voteValue") as sum, $1::int as id FROM hack WHERE "annotationId" = $1::int',
        values: [annotations[i].id],
      }, function(err, result) {
        if (err) console.log(err);
        dict[result.rows[0].id].score = (result.rows[0].sum || 0);
        rows.push(dict[result.rows[0].id]);
        if (++a == annotations.length) {
          next(rows);
        }
      }); 
    }
  },

};
