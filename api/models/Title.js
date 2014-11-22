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
      required: true
    },
    law: {
      model: 'law',
      required: true
    }
  },

};
