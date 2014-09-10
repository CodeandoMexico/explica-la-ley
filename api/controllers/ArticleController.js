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
	
  create: function(req, res) {
    Law.findOne({id: req.param('law')})
    .populate('articles')
    .exec(function(err, law) {
      if (err) {
        console.log('Error al encontar ley:', err);
        return res.send(500, err);
      }
      if (!law) return res.send(500, 'Error: Ley escogida no existe');
      Article.create({
        law: req.param('law'),
        number: req.param('number'),
        body: req.param('body')
      }).exec(function(err, article) {
        if (err) {
          console.log('Error al crear articulo:', err);
          return res.send(500, err);
        }
        return res.redirect('/ley/article/new');
      });
    });
  },

  search: function(req, res) {
    Law.findOne({id: req.param('law')})
    .exec(function(err, law) {
      if (err) {
        console.log('Error al buscar ley:', err);
        res.send(500);
      }
      if (typeof law === 'undefined') {
        return res.redirect('/');
      }
      Article.find({
        sort: 'number ASC',
        law: req.param('law')
      })
      .where({
        'body': {contains: req.param('text')},
      })
      .populate('annotations')
      .exec(function(err, articles) {
        if (err) {
          console.log('Error al buscar articulos:', err);
          res.send(500);
        }
        law.articles = articles;
        res.locals.layout = 'layoutv2';
        return res.view('law/find', {law: law, searchTerm: req.param('text')})
      });
    });
  },

};
