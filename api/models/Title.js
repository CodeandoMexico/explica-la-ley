/**
 * Title.js
 *   Mexican Laws are divided in several sections. These are: titles,
 *   chapters, and sections. Titltes contain chapters, and chapters
 *   contain either articless or sections. A section contains articles.
 */

module.exports = {

  attributes: {
    heading: {
      type: 'STRING',
      required: true
    },
    number: {
      type: 'INTEGER',
      required: true
    },
    chapters: {
      collection: 'chapter',
      via: 'title',
    },
    law: {
      model: 'law',
      required: true
    }
  },

 /*
  * @param {String} action: Contains the controller action from where this
  *  function is being called. Can either be 'create' or 'update'.
  * @param {Object} article: Title object obtained via .find().
  * @param {int} number: Title number to test.
  * @param {int} law_id: The ID of the law that contains this title.
  * @param {Function} cb: Callback function, which is told if the number
  *  is okay to use (eg: there can only be one title with that number
  *  inside a law).
  */
  isNumberOk: function(action, title, number, law_id, cb) {

    function _checkExistence() {
      Title.find({
        number: parseInt(number, 10),
        law: law_id
      }).exec(function(err, titles) {
        if (err) cb(false);
        if (titles.length != 0) {
          // This means that there's already a title with this new number
          // inside this law.
          cb(false);
        } else {
          cb(true);
        }
      });
    }

    if (action == 'update') {
      if (title.number == number) {
        // This means that only this title's heading is being updated.
        cb(true);
      } else {
        _checkExistence();
      }
    } else if (action == 'create') {
      _checkExistence();
    }

  },

  afterDestroy: function(destroyedRecords, cb) {
    // Emulate cascading delete (unsupported by Sails.js at the moment).
    // If a title is destroyed, all of its chapters must be destroyed.
    var targeted_titles = _.pluck(destroyedRecords, 'id');
    if (targeted_titles.length == 0) {
      cb();
    } else {
      Chapter.destroy({title: targeted_titles})
      .exec(function(err, d) {
        if (err) console.log('Error afterDestroy (title model)', err);
        cb();
      }); 
    }   
  }, 

};
