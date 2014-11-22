/**
 * TitleController.js 
 *
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

  edit: function(req, res) {
    if (req.method == 'post' || req.method == 'POST') {
      Law.findOne({id: req.param('law')})
      .populate('tag')
      .exec(function(err, law) {
        if (err) return _error(err, req, res, false);
        if (!law) return _error('Ley no encontrada', req, res, true);
        Title.findOne({id: req.param('title')})
        .exec(function(err, title) {
          if (err) return _error(err, req, res, false);
          if (!title) return _error('Título no encontrado', req, res, true);
          Title.isNumberOk('update', title, req.param('number'), req.param('law'), function(ok) {
            if (ok) {
              Title.update({
                id: title.id
              }, {
                number: parseInt(req.param('number'), 10),
                heading: req.param('heading'),
              }).exec(function(err, titles) {
                if (err) return _error(err, req, res, false);
                if (!titles[0]) return _error('Título a editar no encontrado', req, res, true);
                var return_url = '/ley/' + law.slug + '/indice';
                if (law.tag) {
                  return_url = '/reforma/' + law.tag.slug + return_url;
                }
                return _success('Título editado exitosamente', req, res, return_url);
              });
            } else {
              return _error('Error al actualizar título. Ya existe un título con ese número dentro de esta ley.', req, res, true);
            }
          });
        });
      });
    }
  },
	
  create: function(req, res) {
    if (req.method == 'post' || req.method == 'POST') {
      Law.findOne({id: req.param('law')})
      .populate('tag')
      .exec(function(err, law) {
        if (err) return _error(err, req, res, false);
        if (!law) return _error('Ley no encontrada', req, res, true);
        Title.isNumberOk('create', {}, req.param('number'), req.param('law'), function(ok) {
          if (ok) {
            Title.create({
              law: req.param('law'),
              number: req.param('number'),
              heading: req.param('heading')
            }).exec(function(err, title) {
              if (err) return _error(err, req, res, false);
              var return_url = '/ley/' + law.slug + '/indice';
              if (law.tag) {
                return_url = '/reforma/' + law.tag.slug + return_url;
              }
              return _success('Título creado exitosamente', req, res, return_url);
            });
          } else {
            return _error('Error al crear título. Ya existe un título con ese número dentro de esta ley.', req, res, true);
          }
        });
      });
    }
  },

  destroy: function(req, res) {
    Title.destroy({
      id: req.param('id')
    }).exec(function(err, article) {
      if (err) return _error(err, req, res, false);
      return _success('Título borrado exitosamente', req, res, req.param('origin'));
    });
  },

};
