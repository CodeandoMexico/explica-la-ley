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
    res.locals.layout = 'pages/homepageLayout';
    res.view('pages/homepage')
  }
};
