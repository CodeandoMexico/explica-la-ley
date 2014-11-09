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
    Law.findOne({slug: req.param('law_slug')})
    .populate('tag')
    .exec(function(err, law) {
      if (err) return _error(err, req, res);
      if (!law) return _error('Ley no encontrada', req, res);
      Tag.findOne({slug: req.param('tag_slug')})
      .exec(function(err, tag) {
        if (err) return _error(err, req, res);
        if (!tag) return _error('Tag no encontrada', req, res);
        if (law.tag.id != tag.id) return _error('Esta ley no esta dentro de este tag', req, res);
        Article.find({sort: 'number ASC', law: law.id})
        .populate('annotations')
        .exec(function(err, articles) {
          if (err) return _error(err, req, res);
          law.articles = articles;
          res.locals.layout = 'layoutv2';
          return res.view('law/find', {law: law});
        });
      });
    });
  },

  edit: function(req, res) {
    if (req.method == 'POST' || req.method == 'post') {
      Tag.findOne({id: req.param('tag')}).exec(function(err, tag) {
        if (err) return _error(err, req, res);
        if (!tag) return _error('Tag no encontrada', req, res);
        Law.update({
          id: req.param('id')
        }, {
          name: req.param('name'),
          summary: req.param('summary'),
          tag: req.param('tag')
        }).exec(function(err, laws) {
          if (err) return _error(err, req, res);
          return res.redirect('/reforma/' + tag.slug + '/ley/' + req.param('law_slug'));
        });
      });
    } else if (req.method == 'GET' || req.method == 'get') {
      Law.findOne({slug: req.param('law_slug')}).exec(function(err, law) {
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
      if (typeof req.param('tag') === 'undefined') {
        return res.redirect('/law/create');
      } else {
        Tag.findOne({id: req.param('tag')}).exec(function(err, tag) {
          if (err) return _error(err, req, res);
          if (!tag) return _error('Tag no encontrada', req, res);
          Law.create({
            name: req.param('name'),
            summary: req.param('summary'),
            tag: req.param('tag'),
            slug: req.param('slug')
          }).exec(function(err, law) {
            if (err) return _error(err, req, res);
            return res.redirect('/reforma/' + tag.slug + '/ley/' + law.slug);
          });
        });
      }
    } else if (req.method == 'GET' || req.method == 'get') {
      var args = {};
      var direct = false;

      // Check if the request came from the tag's "find" view.
      if (typeof req.param('tag_id') != 'undefined') {
        args = req.param('tag_id');
        direct = true;
      }

      Tag.find(args).exec(function(err, tags) {
        if (err) return _error(err, req, res);
        res.locals.layout = 'layoutv2';
        return res.view('law/create', {tags: tags, direct: direct});
      });
    }
  },

  destroy: function(req, res) {
    Law.destroy({
      id: req.param('id')
    }).exec(function(err, law) {
      if (err) return _error(err, req, res);
      return res.redirect(req.param('origin'));
    });
  },

  search: function(req, res) {
    Tag.findOne({id: req.param('tag')})
    .populate('laws')
    .exec(function(err, tag) {
      if (err) return _error(err, req, res);
      if (!tag) return _error('Tag inexistente', req, res);
      Law.find({
        sort: 'id ASC',
        tag: req.param('tag')
      })
      .where({
        or: [{
          name: {contains: req.param('text')},
        }, {
          summary: {contains: req.param('text')},
        }]
      })
      .populate('articles')
      .exec(function(err, laws) {
        if (err) return _error(err, req, res);
        if (!laws) laws = []
        tag.laws = laws;
        Law.getAnnotationCount(laws, function(result) {
          res.locals.layout = 'layoutv2';
          return res.view('tag/find', {
            tag: tag,
            laws: laws,
            annotationCounters: result,
            searchTerm: req.param('text')
          });
        });
      });
    });
  },
	
};
