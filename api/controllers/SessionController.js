/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `SessionController.create()`
   */
  new: function (req, res) {
    res.locals.layout = 'layoutv2';
    res.view('session/new');
  }
};

