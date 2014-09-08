/**
 * PageController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  redirect: function (req, res) {
    res.redirect('/ley');
  },

  homepage: function(req, res) {
    // TODO: sort the laws by more annotations
    User.showcaseMembers(function(members) {
      Law.find()
      .limit(4)
      .populate('articles')
      .exec(function(err, laws) {
        Law.getAnnotationCount(laws, function(annotationCounters) {
          res.locals.layout = 'layoutv2';
          res.view('pages/homepage', {
            laws: laws,
            members: members,
            annotationCounters: annotationCounters,
          });
        });
      });
    });
  }
};
