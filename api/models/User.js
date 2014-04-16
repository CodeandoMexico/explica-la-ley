/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
    username: {
      type: 'STRING',
      unique: true,
      required: true
    },
    email: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'STRING',
      required: true,
      minLength: 6
    },
    annotations: {
      collection: 'annotation',
      via: 'article'
    }
	},

  // Encrypt password before create
  beforeCreate: function(attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt){
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash){
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  }

};
