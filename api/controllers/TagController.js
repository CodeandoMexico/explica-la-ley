/**
 * TagController.js 
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
    Tag.find({sort: 'createdAt ASC'}).exec(function(err, tags) {
      if (err) return _error(err, req, res);
      res.locals.layout = 'layoutv2';
      return res.view('tag/index', {tags: tags});
    });
  },

  find: function(req, res) {
    Tag.findOne({slug: req.param('tag_slug')}).exec(function (err, tag) {
      if (err) return _error(err, req, res)
      if (!tag) return _error('Tag no encontrado', req, res);
      // Get the laws this way (not by using populate()), so we get the right
      // "laws" array for getAnnotationCount() to work properly.
      Law.find({tag: tag.id}).populate('articles').exec(function(err, laws) {
        if (err) return _error(err, req, res)
        Law.getAnnotationCount(laws, function(result) {
          res.locals.layout = 'layoutv2';
          return res.view('tag/find', {
            tag: tag,
            laws: laws,
            annotationCounters: result
          });
        });
      });
    });
  },

  edit: function(req, res) {
    if (req.method == 'post' || req.method == 'POST') {
      Tag.update({
        id: req.param('id')
      }, {
        name: req.param('name'),
        slug: req.param('slug'),
        summary: req.param('summary')
      }).exec(function(err, tags) {
        if (err) _error(err, req, res);
        if (!tags) _error('Tag a editar no encontrada', req, res);
        return res.redirect('/reforma/' + tags[0].slug);
      });
    } else if (req.method == 'get' || req.method == 'GET') {
      Tag.findOne({slug: req.param('tag_slug')}).exec(function (err, tag) {
        if (err) return _error(err, req, res);
        if (!tag) return _error('Tag no encontrada', req, res);
        res.locals.layout = 'layoutv2';
        return res.view('tag/edit', {tag: tag});
      });
    }
  },
	
  create: function(req, res) {
    if (req.method == 'post' || req.method == 'POST') {
      Tag.create({
        name: req.param('name'),
        summary: req.param('summary'),
        slug: req.param('slug')
      }).exec(function(err, tag) {
        if (err) return _error(err, req, res);
        return res.redirect('/reforma/' + tag.slug);
      });
    } else if (req.method == 'get' || req.method == 'GET') {
      res.locals.layout = 'layoutv2';
      return res.view('tag/create');
    }
  },

  search: function(req, res) {
    Tag.find({
      sort: 'createdAt ASC'
    })
    .where({
      'name': {contains: req.param('name')},
    })
    .exec(function(err, tags) {
      if (err) _error(err, req, res);
      if (!tags) tags = []
      res.locals.layout = 'layoutv2';
      return res.view('tag/find', {tags: tags, searchTerm: req.param('name')})
    });
  },

};
