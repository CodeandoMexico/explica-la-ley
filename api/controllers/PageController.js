/**
 * PageController.js
 *
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @: ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  return res.redirect('/');
}

module.exports = {

  redirect: function (req, res) {
    res.redirect('/ley');
  },

  homepage: function(req, res) {
    // TODO: sort the laws by more annotations
    User.showcaseMembers(function(members) {
      Tag.find({sort: 'createdAt ASC'}).limit(3).exec(function(err, tags) {
        Law.find().limit(2).populate('tag').populate('articles').exec(function(err, laws) {
          Law.getAnnotationCount(laws, function(annotationCounters) {
            res.locals.layout = 'layoutv2-full-width';
            res.view('pages/homepage', {
              laws: laws,
              members: members,
              annotationCounters: annotationCounters,
              tags: tags,
            });
          });
        });
      });
    });
  },

  admin: function(req, res) {
    res.locals.layout = 'layoutv2-full-width';
    return res.view('pages/admin');
  },

  notificaciones: function(req, res) {
    Notification.find().exec(function(err, notifications) {
      if (err) return _error(err, req, res);
      res.locals.layout = 'layoutv2-full-width';
      return res.view('pages/notificaciones', {notifications: notifications});
    });
  },

};
