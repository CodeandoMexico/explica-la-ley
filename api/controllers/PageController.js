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
  }
};
