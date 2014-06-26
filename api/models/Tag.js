/**
* Tag.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'STRING',
      required: true,
      unique: true
    },
    slug: {
      type: 'STRING',
      unique: true
    },
    laws: {
      collection: 'law',
      via: 'tag'
    }
  },

  // Generate a slug derived from the tag's name
  beforeCreate: function(attrs, next) {
    var slug = require('slug');

    attrs.slug = slug(attrs.name).toLowerCase();
    next();
  }
};

