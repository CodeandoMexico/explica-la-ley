/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  login: function(req, res) {
    if (req.session.user) {
      // Already logged in.
      return res.redirect('/');
    } else {
      sails.config.globals.twitterApi.getRequestToken(
        function(error, requestToken, requestTokenSecret, results) {
        if (error) {
          console.log('Error getting OAuth request token', error);
          return res.redirect('/');
        } else {
          req.session.oauth = {
            requestToken: requestToken,
            requestTokenSecret: requestTokenSecret
          }
          var returnUrl = 'https://twitter.com/oauth/authenticate?oauth_token=' + requestToken;
          return res.redirect(returnUrl);
        }
      });
    }
  },

  twitterAuthCallback: function(req, res) {
    var hasRequestTokens = req.session.oauth &&
                           req.session.oauth.requestToken &&
                           req.session.oauth.requestTokenSecret;

    if (hasRequestTokens) {
      sails.config.globals.twitterApi.getAccessToken(
        req.session.oauth.requestToken,
        req.session.oauth.requestTokenSecret,
        req.param('oauth_verifier'),
        function(error, accessToken, accessTokenSecret, results) {
        if (error) {
          console.log('Error getting access token:', error);
          return res.redirect('/');
        } else {
          sails.config.globals.twitterApi.verifyCredentials(
            accessToken, 
            accessTokenSecret, 
            function(error, data, response) {
            if (error) {
              console.log('Error verifying credentials:', error);
              return res.redirect('/');
            } else {
              req.session.user = {
                twitterScreenName: data.screen_name,
                twitterName: data.name,
                twitterProfileImageUrl: data.profile_image_url,
                twitterId: data.id
              }
              User.findOne({twitterId: data.id})
              .exec(function(err, user) {
                if (!user) {
                  // First time I see this twitter user.
                  User.create({
                    twitterId: data.id,
                    twitterScreenName: data.screen_name,
                    twitterName: data.name
                  }).exec(function(err, user) {
                    if (err) {
                      console.log('Error creating user:', err);
                      req.session.user = null;
                      req.session.oauth = null;
                      return res.redirect('/');
                    } else {
                      req.session.user.id = user.id;
                      return res.redirect('/');
                    }
                  });
                } else {
                  req.session.user.id = user.id;
                  req.session.user.email = user.email;
                  if (user.twitterScreenName != data.screen_name) {
                    // This user changed twitter screen name since the last visit.
                    // Update that info.
                    User.update({
                      twitterId: data.id
                    }, {
                      twitterScreenName: data.screen_name
                    }).exec(function(err, users) {
                      return res.redirect('/');
                    });
                  } else {
                    return res.redirect('/');
                  }
                }
              });
            }
          });
       }
      });
    } else {
      // The user got here by accessing an invalid or
      // incomplete twitter oauth URL.
      req.session.user = null;
      req.session.oauth = null;
      return res.redirect('/');
    }
  },

  logout: function(req, res) {
    req.session.user = null;
    return res.redirect('/ley');
  },

  profile: function(req, res) {
    res.locals.layout = 'layoutv2';
    return res.view();
  },

  saveEmail: function(req, res) {
    User.update({
      id: req.session.user.id
    }, {
      email: req.param('email')
    }).exec(function(err, user) {
      if (err) {
        console.log('Error saving email:', err);
      } else {
        req.session.user.email = req.param('email');
      }
      return res.redirect('/ley/user');
    });
  },

  forgetEmail: function(req, res) {
    User.update({
      id: req.session.user.id
    }, {
      email: ''
    }).exec(function(err, user) {
      if (err) {
        console.log('Error forgetting email:', err);
      } else {
        req.session.user.email = '';
      }
      return res.redirect('/ley/user');
    });

  }

};
