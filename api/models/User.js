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
    twitterProfile: {
      type: 'STRING',
      required: true,
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
  },

  showcaseMembers: function(cb) {
    // TODO: Define criteria for the members to be showcased in the homepage
    // and based on that criteria also rename this method to something more
    // meaningful.
    cb([
      {
        name: 'Israel Rosas',
        avatarUrl: 'https://pbs.twimg.com/profile_images/378800000693344300/f77fe0a85b6ece1a200ff98a11239e8e_400x400.jpeg',
        twitterProfile: '@irosasr',
        bio:'Integrante de <a href="https://twitter.com/internetsociety" target="_blank">@internetsociety</a> México y <a href="https://twitter.com/wikimedia_mx" target="_blank">@Wikimedia_mx</a>. Internet y telecomunicaciones (a título personal) en <a href="https://twitter.com/poblanerias" target="_blank">@Poblanerias</a>, <a href="https://twitter.com/fayerwayer" target="_blank">@FayerWayer</a>, <a href="https://twitter.com/ladobemx" target="_blank">@ladobemx</a> y <a href="http://irosasr.mx" target="_blank">irosasr.mx</a>'
      },
      {
        name: 'Jesús Romo',
        avatarUrl: 'https://pbs.twimg.com/profile_images/455007702280712192/2n1QFsK8_400x400.jpeg',
        twitterProfile: '@Dackjaniel',
        bio:'Analista independiente de telecomunicaciones, medios y TICs con experiencia en periodismo. Exatec. ITESM (LMI) y EGAP (Maestría en Análisis político y Medios).'
      }
    ]);
  }

};
