/**
 * ArticleController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {
    Article.find({sort: 'number ASC', law: req.param('law')}).exec(function(err, articles) {
      if (err) return res.send(500);
      return res.json(articles);
    });
  },

  find: function(req, res) {
    Article.findOne(req.param('id')).populate('law').exec(function (err, article) {
      if (err) {
        return res.send(500);
      }
      res.locals.layout = 'layoutv2';
      return res.view('article/find', {article: article});
    });
  },

  newArticle: function(req, res) {
    Law.find({}).exec(function(err, laws) {
      if (err) return res.send(500, err);
      res.locals.layout = 'layoutv2';
      return res.view('article/new', {laws: laws});
    });
  },

  edit: function(req, res) {
    Article.findOne(req.param('id')).exec(function (err, article) {
      if (err) return res.send(500, err);
      Law.find({}).exec(function(err, laws) {
        if (err) return res.send(500, err);
        res.locals.layout = 'layoutv2';
        return res.view('article/edit', {article: article, laws: laws});
      });
    });
  },
	
};
