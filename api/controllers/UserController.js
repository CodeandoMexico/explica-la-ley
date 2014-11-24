/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @ ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  return res.redirect('/');
}

function _success(msg, req, res, return_url) {
  req.session.flash = {
    type: 'success',
    msg: msg
  }
  return res.redirect(return_url || '/');
}

module.exports = {

  login: function(req, res) {
    if (req.session.user) {
      return _error('Trying to login while logged-in', req, res);
    } else {
      sails.config.globals.twitterApi.getRequestToken(
        function(error, requestToken, requestTokenSecret, results) {
        if (error) {
          return _error('Error getting OAuth request token: ' + error, req, res);
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
          return _error('Error getting access token: ' + error, req, res);
        } else {
          sails.config.globals.twitterApi.verifyCredentials(
            accessToken, 
            accessTokenSecret, 
            function(error, data, response) {
            if (error) {
              return _error('Error verifying credentials: ' + error, req, res);
            } else {
              req.session.user = {
                twitterScreenName: data.screen_name,
                twitterName: data.name.replace(/</g,"&lt;").replace(/>/g,"&gt;"),
                twitterProfileImageUrl: data.profile_image_url,
                twitterId: data.id
              }
              User.findOne({twitterId: data.id})
              .exec(function(err, user) {
                if (err) return _error(err, req, res);
                if (!user) {
                  // First time I see this twitter user.
                  User.create({
                    twitterId: data.id,
                    twitterScreenName: data.screen_name,
                    twitterName: data.name.replace(/</g,"&lt;").replace(/>/g,"&gt;"),
                    role: 'user',
                    twitterImageUrl: data.profile_image_url
                  }).exec(function(err, user) {
                    if (err) {
                      req.session.user = null;
                      req.session.oauth = null;
                      return _error('Error creating user: ' + err, req, res);
                    } else {
                      req.session.user.id = user.id;
                      req.session.user.role = user.role;
                      return res.redirect('/');
                    }
                  });
                } else {
                  req.session.user.id = user.id;
                  req.session.user.email = user.email;
                  req.session.user.role = user.role;
                  if (user.twitterScreenName != data.screen_name || user.twitterImageUrl != data.profile_image_url) {
                    // This user changed twitter screen name or picture since the last visit.
                    // Update that info.
                    User.update({
                      twitterId: data.id
                    }, {
                      twitterScreenName: data.screen_name,
                      twitterImageUrl: data.profile_image_url
                    }).exec(function(err, users) {
                      if (err) return _error(err, req, res);
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
      return _error('Invalid OAuth URL', req, res);
    }
  },

  logout: function(req, res) {
    req.session.user = null;
    return res.redirect('/ley');
  },

  profile: function(req, res) {
    User.findOne({id: req.session.user.id})
    .exec(function(err, user) {
      if (err) return _error(err, req, res, false);
      if (!user) return _error('Usuario no encontrado', req, res, true);
      res.locals.layout = 'layoutv2';
      return res.view({user: user});
    });
  },

  saveBio: function(req, res) {
    User.update({id: req.session.user.id}, {bio: req.param('bio')})
    .exec(function(err, users) {
      if (err) return _error(err, req, res, false);
      if (!users[0]) return _error('Usuario no encontrado', req, res, true);
      return _success('Perfil actualizado', req, res, '/perfil');
    });
  },

  saveEmail: function(req, res) {
    User.update({
      id: req.session.user.id
    }, {
      email: req.param('email')
    }).exec(function(err, user) {
      if (err) return _error(err, req, res);
      req.session.user.email = req.param('email');
      return _success('Perfil actualizado', req, res, '/perfil');
    });
  },

  forgetEmail: function(req, res) {
    User.update({
      id: req.session.user.id
    }, {
      email: ''
    }).exec(function(err, user) {
      if (err) return _error(err, req, res);
      req.session.user.email = '';
      return _success('Perfil actualizado', req, res, '/perfil');
    });
  },

  find: function(req, res) {
    User.findOne({id: req.param('user_id')})
    .populate('annotations')
    .exec(function(err, user) {
      if (err) return _error(err, req, res, false);
      if (!user) return _error('Usuario no encontrado', req, res, true);
      var user_public_data               = {};
      user_public_data.name              = user.twitterName;
      user_public_data.twitter           = user.twitterScreenName;
      user_public_data.role              = user.role;
      user_public_data.bio               = user.bio;
      user_public_data.annotation_count  = user.annotations.length;
      user_public_data.avatar            = user.twitterImageUrl;
      res.locals.layout = 'layoutv2';
      return res.view({user_public_data: user_public_data});
    });
  },

};
