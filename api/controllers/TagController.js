/**
 * TagController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function _error(msg, req, res, show_flash) {
  console.log('(!!) ERROR @ ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  if (show_flash) {
    req.session.flash = {
      type: 'error',
      msg: msg
    }
  }
  return res.redirect('/');
}

function _success(msg, req, res, return_url) {
  req.session.flash = {
    type: 'success',
    msg: msg
  }
  return res.redirect(return_url || '/');
}

module.exports = {

  index: function(req, res) {
    Tag.find({sort: 'createdAt ASC'}).exec(function(err, tags) {
      if (err) return _error(err, req, res, false);
      res.locals.layout = 'layoutv2';
      return res.view('tag/index', {tags: tags});
    });
  },

  find: function(req, res) {
    Tag.findOne({slug: req.param('tag_slug')}).exec(function (err, tag) {
      if (err) return _error(err, req, res, false)
      if (!tag) return _error('Tag no encontrada', req, res, true);
      // Get the laws this way (not by using populate()), so we get the right
      // "laws" array for getAnnotationCount() to work properly.
      Law.find({tag: tag.id}).populate('articles').exec(function(err, laws) {
        if (err) return _error(err, req, res, false)
        if (!laws) return _error('Leyes no encontradas', req, res, true);
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
        if (err) return _error(err, req, res, false);
        if (!tags) return _error('Tag a editar no encontrada', req, res, true);
        return _success('Tag editada exitosamente', req, res, '/reforma/' + tags[0].slug);
      });
    } else if (req.method == 'get' || req.method == 'GET') {
      Tag.findOne({slug: req.param('tag_slug')}).exec(function (err, tag) {
        if (err) return _error(err, req, res, false);
        if (!tag) return _error('Tag no encontrada', req, res, true);
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
        if (err) return _error(err, req, res, false);
        return _success('Tag creada exitosamente', req, res, '/reforma/' + tag.slug);
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
      if (err) return _error(err, req, res, false);
      if (!tags) tags = []
      res.locals.layout = 'layoutv2';
      return res.view('tag/find', {tags: tags, searchTerm: req.param('name')})
    });
  },

  destroy: function(req, res) {
    Tag.destroy({
      id: req.param('id')
    }).exec(function(err, tag) {
      if (err) return _error(err, req, res, false);
      return _success('Tag borrada exitosamente', req, res, '/');
    });
  },

};
