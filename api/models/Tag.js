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
    summary: {
      type: 'STRING',
      required: true
    },
    laws: {
      collection: 'law',
      via: 'tag'
    }
  },

  getFriendlyDate: function(date) {
    var moment = require('moment');
    moment.locale('es-MX');
    return moment(date).fromNow();
  }

};

