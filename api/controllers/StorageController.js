/**
 * StorageController.js 
 *
 * @description :: Storage index endpoint for the annotator js script
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {
    res.json({
      name: 'Annotator Store API',
      version: '2.0.0'
    });
  }
	
};
