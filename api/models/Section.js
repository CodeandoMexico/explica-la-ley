/**
 * Section.js
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
    articles: {
      collection: 'article',
      via: 'section',
      required: true
    },
    chapter: {
      model: 'chapter',
      required: true
    }
  },

};
