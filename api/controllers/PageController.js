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
    // TODO: sort the laws by more annotations and only return 4 of them
    User.showcaseMembers(function(members) {
      Law.find().limit(4).exec(function(err, laws) {
        res.locals.layout = 'layoutv2';
        res.view('pages/homepage', {laws: laws, members: members});
      });
    });
  }
};
