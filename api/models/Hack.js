/**
 * Hack.js
 *
 * Since sails.js doesn't support N-to-N through associations yet:
 * http://sailsjs.org/#/documentation/concepts/ORM/Associations/ThroughAssociations.html
 * Use this model to hold the votes from users to annotations.
 * This model simulates an N-to-N table with the following columns:
 * [ userId | annotationId | voteValue]
 * This model should be replaced with proper N-to-N through associations
 * as soon as they become available in sails.js.
 * More info on issue #78's page.
 * 
 */

module.exports = {
  attributes: {
    userId: 'INTEGER',
    annotationId: 'INTEGER',
    voteValue: {
      type: 'INTEGER',
      enum: [-1, +1]
    },
  },
};
