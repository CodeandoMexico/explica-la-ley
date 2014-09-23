/**
 * Vote.js
 *
 * Intermediary model.
 * http://sailsjs.org/#/documentation/concepts/ORM/Associations/ThroughAssociations.html
 * 
 */

module.exports = {
  attributes: {
    user: {
      model: 'user'
    },
    annotation: {
      model: 'annotation'
    },
    value: {
      type: 'INTEGER',
      enum: [-1, +1]
    },
  },
};
