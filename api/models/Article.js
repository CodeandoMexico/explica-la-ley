/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    number: 'INTEGER',
    body: 'STRING',
    law: {
      model: 'law'
    },
    annotations: {
      collection: 'annotation',
      via: 'article',
      dominant: true
    }
  },

  beforeCreate: function(attrs, next) {
    var marked = require('marked');
    marked(attrs.body, function(err, body) {
      if (err) return next(err);

      attrs.body = body;
      next();
    });
  },

  beforeUpdate: function(attrs, next) {
    var marked = require('marked');
    marked(attrs.body, function(err, body) {
      if (err) return next(err);

      attrs.body = body;
      next();
    });
  },

  afterDestroy: function(destroyedRecords, cb) {
    // Emulate cascading delete (unsupported by Sails.js at the moment).
    // If an article is destroyed, all of its annotations must destroyed as well.
    var targeted_articles = _.pluck(destroyedRecords, 'id');
    if (targeted_articles.length == 0) {
      cb();
    } else {
      Annotation.destroy({article: targeted_articles})
      .exec(function(err, d) {
        if (err) console.log('Error afterDestroy (article model)', err);
        cb();
      });
    }
  },

};
