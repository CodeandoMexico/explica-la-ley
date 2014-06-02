/**
 * LawController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  newLaw: function(req, res) {
    return res.view('law/new');
  },
	
};
