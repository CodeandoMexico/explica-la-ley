/**
 * Law.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'STRING',
      required: true
    },
    summary: {
      type: 'STRING',
      required: true
    },
    slug: {
      type: 'STRING',
      unique: true
    },
    articles: {
      collection: 'article',
      via: 'law'
    },
    tag: {
      model: 'tag'
    }
  },

  beforeCreate: function(attrs, next) {
    var slug = require('slug');
    attrs.slug = slug(attrs.name).toLowerCase();
    next();
  },

  beforeUpdate: function(attrs, next) {
    var slug = require('slug');
    attrs.slug = slug(attrs.name).toLowerCase();
    next();
  },

 /* 
  * @param {Array} laws: Array of Law objects. This array must be the one
  *  returned by Law.find(). The ones returned by .populate() will make this
  *  this code fail.
  * @param {Function} next: Callback that runs when all laws are processed.
  * @return {Object} annotationCounters: Contains the number of annotations
  * each law has. The law's ID is the key, the annotation count is the value.
  */
  getAnnotationCount: function(laws, next) {
    if (typeof laws === 'undefined' || laws == null || !laws || laws.length == 0) next({});
    var annotationCounters = {};
    var l = 0; // Holds the number of processed laws.
    for (i in laws) {
      Law.query({
        text: 'SELECT $1::int as law, COUNT(*) as count FROM annotation WHERE article IN (SELECT id FROM article WHERE law = $1::int)',
        values: [laws[i].id],
      }, function(err, result) {
        if (err) console.log(err);
        annotationCounters[result.rows[0].law] = result.rows[0].count;
        if (++l == laws.length) next(annotationCounters);
      });
    }
  },

};
