/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    twitterId: {
      type: 'STRING',
      required: true
    },
    twitterScreenName: {
      type: 'STRING',
      required: true,
    },
    twitterName: {
      type: 'STRING',
      required: true
    },
    twitterImageUrl: {
      type: 'STRING',
    },
    email: {
      type: 'EMAIL',
    },
    bio: {
      type: 'STRING',
      defaultsTo: ''
    },
    role: {
      type: 'STRING',
      enum: ['user', 'expert', 'admin']
    },
    annotations: {
      collection: 'annotation',
      via: 'user'
    },
    voted_for: {
      collection: 'vote',
      via: 'annotation',
      dominant: true,
    },

    toJSON: function() {
      var obj = this.toObject();
      // Delete private attributes here from outgoing objects.
      delete obj.email;
      return obj;
    }
	},

  showcaseMembers: function(cb) {
    // TODO: Define criteria for the members to be showcased in the homepage
    // and based on that criteria also rename this method to something more
    // meaningful.
    cb([
      {
        name: 'Alejandro López',
        avatarUrl: 'https://pbs.twimg.com/client_application_images/1341636/explica_small.png',
        twitterProfile: '',
        bio:''
      },
      {
        name: 'Daniel Butruille',
        avatarUrl: 'https://pbs.twimg.com/client_application_images/1341636/explica_small.png',
        twitterProfile: '',
        bio:''
      },
      {
        name: 'Sandrine Molinard',
        avatarUrl: 'https://pbs.twimg.com/client_application_images/1341636/explica_small.png',
        twitterProfile: '',
        bio:''
      },
      {
        name: 'Eduardo Román',
        avatarUrl: 'https://pbs.twimg.com/client_application_images/1341636/explica_small.png',
        twitterProfile: '',
        bio:''
      },
      {
        name: 'Cecy Martínez',
        avatarUrl: 'https://pbs.twimg.com/client_application_images/1341636/explica_small.png',
        twitterProfile: '',
        bio:''
      },
    ]);
  }

};
