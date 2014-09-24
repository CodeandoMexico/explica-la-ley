/**
 * LawController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @: ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  return res.redirect('/');
}

// Compare function to use with Array.sort()
// compares articles by the amount of annotations
// DESC order
var descCompareArticles = function(a, b) {
  if (a.annotations.length < b.annotations.length) return 1;
  if (a.annotations.length > b.annotations.length) return -1;
  return 0;
};

module.exports = {

  index: function(req, res) {
    var slug = req.param("tag");
    // Filter laws by tag.
    Tag.findOne({slug: slug}).exec(function(err, tag) {
      // If tag found, use it as filter.
      var filterCriteria = tag ? {tag: tag.id} : {};
      if (err) return _error(err, req, res);
      Law.find(filterCriteria).exec(function(err, laws) {
        if (err) return _error(err, req, res);
        Tag.find().exec(function(err, tags) {
          if (err) return _error(err, req, res);
          res.locals.layout = 'layoutv2';
          res.view('law/index', {laws: laws, tags: tags});
        });
      });
    });
  },

  find: function(req, res) {
    Law.findOne({id: req.param('id')}).exec(function(err, law) {
      if (err) return _error(err, req, res);
      if (!law) return _error('Ley no encontrada', req, res);
      Article.find({sort: 'number ASC', law: req.param('id')})
      .populate('annotations')
      .exec(function(err, articles) {
        if (err) return _error(err, req, res);
        law.articles = articles;
        res.locals.layout = 'layoutv2';
        return res.view('law/find', {law: law});
      });
    });
  },

  edit: function(req, res) {
    if (req.method == 'POST' || req.method == 'post') {
      Law.update({
        id: req.param('id')
      }, {
        name: req.param('name'),
        summary: req.param('summary'),
        tag: req.param('tag')
      }).exec(function(err, laws) {
        if (err) return _error(err, req, res);
        return res.redirect('/ley/law/' + laws[0].id);
      });
    } else if (req.method == 'GET' || req.method == 'get') {
      Law.findOne(req.param('id')).exec(function(err, law) {
        if (err) return _error(err, req, res);
        if (!law) return _error('Ley no encontrada', req, res);
        Tag.find({}).exec(function(err, tags) {
          if (err) return _error(err, req, res);
          res.locals.layout = 'layoutv2';
          return res.view('law/edit', {law: law, tags: tags});
        });
      });
    }
  },

  create: function(req, res) {
    if (req.method == 'POST' || req.method == 'post') {
      Law.create({
        name: req.param('name'),
        summary: req.param('summary'),
        tag: req.param('tag')
      }).exec(function(err, law) {
        if (err) return _error(err, req, res);
        return res.redirect('/ley/law/' + law.id);
      });
    } else if (req.method == 'GET' || req.method == 'get') {
      Tag.find({}).exec(function(err, tags) {
        if (err) return _error(err, req, res);
        res.locals.layout = 'layoutv2';
        return res.view('law/create', {tags: tags});
      });
    }
  },
	
};
