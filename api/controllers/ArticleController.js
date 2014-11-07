/**
 * ArticleController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @: ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  return res.redirect('/');
}

module.exports = {

  index: function(req, res) {
    Article.find({sort: 'number ASC', law: req.param('law')}).exec(function(err, articles) {
      if (err) return res.send(500);
      return res.json(articles);
    });
  },

  find: function(req, res) {
    Law.findOne({slug: req.param('law_slug')})
    .populate('tag')
    .exec(function(err, law) {
      if (err) return _error(err, req, res);
      if (!law) return _error('Ley no encontrada', req, res);
      Article.findOne({
        number: req.param('article_number'),
        law: law.id
      }).exec(function(err, article) {
        if (err) return _error(err, req, res)
        if (!article) return _error('Articulo no encontrado', req, res);
        res.locals.layout = 'layoutv2';
        return res.view('article/find', {article: article, law: law});
      });
    });
  },

  edit: function(req, res) {
    if (req.method == 'post' || req.method == 'POST') {
      var body = typeof req.param('body') === 'undefined' ? '' : req.param('body').trim();
      Article.update({
        id: req.param('id')
      }, {
        number: parseInt(req.param('number'), 10),
        body: req.param('body'),
      }).exec(function(err, articles) {
        if (err) _error(err, req, res);
        if (!articles[0]) _error('Articulo a editar no encontrado', req, res);
        return res.redirect('/reforma/' + req.param('tag_slug') + '/ley/' + req.param('law_slug') + '/articulo/' + req.param('number'));
      });
    } else if (req.method == 'get' || req.method == 'GET') {
      Law.findOne({slug: req.param('law_slug')})
      .populate('tag')
      .exec(function(err, law) {
        if (err) return _error('Error al buscar leyes', req, res);
        if (!law) _error('Ley no encontrada', req, res);
        Article.findOne({
          number: req.param('article_number'),
          law: law.id
        }).exec(function (err, article) {
          if (err) return _error(err, req, res);
          if (!article) return _error('Articulo no encontrado', req, res);
          article.body = typeof article.body === 'undefined' ? '' : article.body.trim();
          res.locals.layout = 'layoutv2';
          return res.view('article/edit', {article: article, law: law});
        });
      });
    }
  },
	
  create: function(req, res) {
    if (req.method == 'post' || req.method == 'POST') {
      Law.findOne({id: req.param('law')})
      .populate('articles')
      .populate('tag')
      .exec(function(err, law) {
        if (err) return _error(err, req, res);
        if (!law) return _error('Ley no encontrada', req, res);
        Article.create({
          law: req.param('law'),
          number: req.param('number'),
          body: req.param('body')
        }).exec(function(err, article) {
          if (err) return _error(err, req, res);
          return res.redirect('/reforma/' + law.tag.slug + '/ley/' + law.slug + '/articulo/' + req.param('number'));
        });
      });
    } else if (req.method == 'get' || req.method == 'GET') {
      Law.find({}).exec(function(err, laws) {
        if (err) return _error('Error al buscar leyes ' + err, req, res);
        res.locals.layout = 'layoutv2';
        return res.view('article/create', {laws: laws});
      });
    }
  },

  search: function(req, res) {
    Law.findOne({id: req.param('law')})
    .populate('tag')
    .exec(function(err, law) {
      if (err) _error(err, req, res);
      if (!law) _error('Ley inexistente', req, res);
      Article.find({
        sort: 'number ASC',
        law: req.param('law')
      })
      .where({
        'body': {contains: req.param('text')},
      })
      .populate('annotations')
      .exec(function(err, articles) {
        if (err) _error(err, req, res);
        if (!articles) articles = []
        law.articles = articles;
        res.locals.layout = 'layoutv2';
        return res.view('law/find', {law: law, searchTerm: req.param('text')})
      });
    });
  },

  destroy: function(req, res) {
    Article.destroy({
      id: req.param('id')
    }).exec(function(err, article) {
      if (err) return _error(err, req, res);
      return res.redirect(req.param('origin'));
    });
  },

};
