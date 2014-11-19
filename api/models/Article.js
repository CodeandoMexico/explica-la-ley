/**
 * Article.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    number: {
      type: 'INTEGER',
      required: true
    },
    body: {
      type: 'STRING',
      required: true
    },
    law: {
      model: 'law'
    },
    annotations: {
      collection: 'annotation',
      via: 'article',
      dominant: true
    }
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


 /*
  * @param {String} action: Contains the controller action from where this
  *  function is being called. Can either be 'create' or 'update'.
  * @param {Object} article: Article object obtained via .find().
  * @param {int} number: Article number to test.
  * @param {int} law_id: The ID of the law that contains this article.
  * @param {Function} cb: Callback function, which is told if the number
  *  is okay to use (eg: there can only be one article with that number
  *  inside a law).
  */
  isNumberOk: function(action, article, number, law_id, cb) {

    function _checkExistence() {
      Article.find({
        number: number,
        law: law_id
      }).exec(function(err, articles) {
        if (err) cb(false);
        if (articles.length != 0) {
          // This means that there's already an article with this new number
          // inside this law.
          cb(false);
        } else {
          cb(true);
        }
      });
    }

    if (action == 'update') {
      if (article.number == number) {
        // This means that only this article's body is being updated.
        cb(true);
      } else {
        _checkExistence();
      }
    } else if (action == 'create') {
      _checkExistence();
    }

  },

};
