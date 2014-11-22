/**
 * LawController.js 
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
      if (err) return _error(err, req, res, false);
      Law.find(filterCriteria).exec(function(err, laws) {
        if (err) return _error(err, req, res, false);
        Tag.find().exec(function(err, tags) {
          if (err) return _error(err, req, res, false);
          res.locals.layout = 'layoutv2';
          res.view('law/index', {laws: laws, tags: tags});
        });
      });
    });
  },

  showIndex: function(req, res) {

    var tagged = typeof req.param('tag_slug') !== 'undefined';

    function _trickleDown_Law_Titles_Chapters_Sections_Articles(cb) {
      Law.findOne({slug: req.param('law_slug')})
      .exec(function(err, law) {
        if (err) return _error(err, req, res, false);
        if (!law) return _error('Ley no encontrada', req, res, true);
        Title.find({law: law.id, sort: 'number ASC'})
        .exec(function(err, titles) {
          if (err) return _error(err, req, res, false);
          var title_ids = _.uniq(_.pluck(titles, 'id'));
          Chapter.find({title: title_ids, sort: 'number ASC'})
          .exec(function(err, chapters) {
            if (err) return _error(err, req, res, false);
            var chapter_ids = _.uniq(_.pluck(chapters, 'id'));
            Section.find({chapter: chapter_ids, sort: 'number ASC'})
            .exec(function(err, sections) {
              if (err) return _error(err, req, res, false);
              var section_ids = _.uniq(_.pluck(sections, 'id'));
              Article.find({section: section_ids, sort: 'number ASC'})
              .exec(function(err, articles_under_section) {
                if (err) return _error(err, req, res, false);
                Article.find({section: null, chapter: chapter_ids, sort: 'number ASC'})
                .exec(function(err, articles_under_chapter) {
                  if (err) return _error(err, req, res, false);
                  cb({
                    law                     : law,
                    titles                  : titles,
                    chapters                : chapters,
                    sections                : sections,
                    articles_under_section  : articles_under_section,
                    articles_under_chapter  : articles_under_chapter
                  });
                });
              });
            });
          });
        });
      });
    }

    if (tagged) {
      Tag.findOne({slug: req.param('tag_slug')})
      .exec(function(err, tag) {
        if (err) return _error(err, req, res, false);
        if (!tag) return _error('Tag no encontrada', req, res, true);
        _trickleDown_Law_Titles_Chapters_Sections_Articles(function(data) {
          if (tag.id != data.law.tag) return _error('URL inválida', req, res, true);
          data.tag = tag;
          res.locals.layout = 'layoutv2';
          return res.view('law/findOrganized', data);
        });
      });
    } else {
      _trickleDown_Law_Titles_Chapters_Sections_Articles(function(data) {
        res.locals.layout = 'layoutv2';
        return res.view('law/findOrganized', data);
      });
    }

  },

  find: function(req, res) {

    var tagged = typeof req.param('tag_slug') !== 'undefined';

    function _trickleDown_Law_Articles(cb) {
      Law.findOne({slug: req.param('law_slug')})
      .populate('tag') // Doesn't matter whether it's tagged or not -- avoids doing another find().
                       // Not populating articles since we need their annotations data.
      .exec(function(err, law) {
        if (err) return _error(err, req, res, false);
        if (!law) return _error('Ley no encontrada', req, res, true);
        Article.find({law: law.id, sort: 'number ASC'})
        .populate('annotations')
        .exec(function(err, articles) {
          if (err) return _error(err, req, res, false);
          cb({law: law, articles: articles});
        });
      });
    }

    if (tagged) {
      Tag.findOne({slug: req.param('tag_slug')})
      .exec(function(err, tag) {
        if (err) return _error(err, req, res, false);
        if (!tag) return _error('Tag no encontrada', req, res, true);
        _trickleDown_Law_Articles(function(data) {
          res.locals.layout = 'layoutv2';
          if (tag.id != data.law.tag.id) {
            return _error('Error: URL inválida', req, res, true);
          } else {
            data.tag = tag;
            return res.view('law/find', data);
          }
        });
      });
    } else {
      _trickleDown_Law_Articles(function(data) {
        res.locals.layout = 'layoutv2';
        return res.view('law/find', data);
      });
    }
  },

  edit: function(req, res) {
    if (req.method == 'POST' || req.method == 'post') {
      var tagged = req.param('tag') == '' ? false : true;
      if (tagged) {
        Tag.findOne({id: req.param('tag')}).exec(function(err, tag) {
          if (err) return _error(err, req, res, false);
          if (!tag) return _error('Tag no encontrada', req, res, true);
          Law.update({
            id: req.param('id')
          }, {
            name: req.param('name'),
            summary: req.param('summary'),
            tag: req.param('tag')
          }).exec(function(err, laws) {
            if (err) return _error(err, req, res, false);
            if (!laws[0]) return _error('Ley no encontrada', req, res, true);
            return _success('Ley editada exitosamente', req, res, '/reforma/' + tag.slug + '/ley/' + req.param('law_slug'));
          });
        });
      } else {
        Law.update({
          id: req.param('id')
        }, {
          name: req.param('name'),
          summary: req.param('summary'),
          tag: null
        }).exec(function(err, laws) {
          if (err) return _error(err, req, res, false);
          if (!laws[0]) return _error('Ley no encontrada', req, res, true);
          return _success('Ley editada exitosamente', req, res, '/ley/' + req.param('law_slug'));
        });
      }
    } else if (req.method == 'GET' || req.method == 'get') {
      Law.findOne({slug: req.param('law_slug')}).exec(function(err, law) {
        if (err) return _error(err, req, res, false);
        if (!law) return _error('Ley no encontrada', req, res, true);
        Tag.find({}).exec(function(err, tags) {
          if (err) return _error(err, req, res, false);
          res.locals.layout = 'layoutv2';
          return res.view('law/edit', {law: law, tags: tags});
        });
      });
    }
  },

  create: function(req, res) {
    if (req.method == 'POST' || req.method == 'post') {
      var tagged = req.param('tag') == '' ? false : true;
      if (tagged) {
        Tag.findOne({id: req.param('tag')}).exec(function(err, tag) {
          if (err) return _error(err, req, res, false);
          if (!tag) return _error('Tag no encontrada', req, res, true);
          Law.create({
            name: req.param('name'),
            summary: req.param('summary'),
            tag: req.param('tag'),
            slug: req.param('slug')
          }).exec(function(err, law) {
            if (err) return _error(err, req, res, false);
            if (!law) return _error('Error al crear ley', req, res, true);
            return _success('Ley creada exitosamente', req, res, '/reforma/' + tag.slug + '/ley/' + law.slug);
          });
        });
      } else {
        Law.create({
          name: req.param('name'),
          summary: req.param('summary'),
          tag: null,
          slug: req.param('slug')
        }).exec(function(err, law) {
          if (err) return _error(err, req, res, false);
          if (!law) return _error('Error al crear ley', req, res, true);
          return _success('Ley creada exitosamente', req, res, '/ley/' + law.slug);
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
        if (err) return _error(err, req, res, false);
        res.locals.layout = 'layoutv2';
        return res.view('law/create', {tags: tags, direct: direct});
      });
    }
  },

  destroy: function(req, res) {
    Law.destroy({
      id: req.param('id')
    }).exec(function(err, law) {
      if (err) return _error(err, req, res, false);
      return _success('Ley borrada exitosamente', req, res, req.param('origin'));
    });
  },

  search: function(req, res) {
    Tag.findOne({id: req.param('tag')})
    .populate('laws')
    .exec(function(err, tag) {
      if (err) return _error(err, req, res, false);
      if (!tag) return _error('Tag inexistente', req, res, true);
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
        if (err) return _error(err, req, res, false);
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
