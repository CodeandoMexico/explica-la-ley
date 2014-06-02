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

  edit: function(req, res) {
    Law.findOne(req.param('id')).exec(function(err, law) {
      if (err) return res.send(500, err);
      return res.view('law/edit', {law: law});
    });
  }
	
};
