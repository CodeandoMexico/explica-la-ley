/**
 * AnnotationController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function _error(msg, req, res) {
  console.log('(!!) ERROR @: ' + req.options.controller + '/' + req.options.action);
  console.log(msg);
  return res.send(500);
}

module.exports = {

  index: function(req, res) {
    Annotation.find({article: req.param('article')})
    .populate('user')
    .populate('voted_by')
    .exec(function(err, annotations) {
      if (err) return _error(err, req, res);
      // Annotator.js needs this variable to be called 'rows'.
      return res.json({rows: annotations});
    });
  },

  // Creates an annotation for an article
  create: function(req, res) {
    User.findOne({id: req.session.user.id})
    .exec(function(err, user) {
      if (err) return _error(err, req, res);
      Annotation.create({
        text: req.param('text'),
        quote: req.param('quote'),
        ranges: req.param('ranges'),
        article: req.param('article'),
        user: user
      })
      .exec(function(err, annotation) {
        if (err) return _error(err, req, res);
        res.json(annotation);
      });
    });
  },

  update: function(req, res) {
    Annotation.update({
      id: req.param('id'),
      user: req.session.user.id
    }, {
      text: req.param('text'),
      quote: req.param('quote')
    }).exec(function(err, annotations) {
      if (err) return _error(err, req, res);
      if (annotations.length == 0) {
        // No combination of owner ID and annotation ID.
        // This means that a user is trying to update an
        // annotation that was written by someone else.
        res.send(403);
      } else {
        res.json(annotations);
      }
    });
  },

  destroy: function(req, res) {
    Annotation.destroy({
      id: req.param('id'),
      user: req.session.user.id
    }).exec(function(err, annotations) {
      if (err) return _error(err, req, res);
      if (annotations.length == 0) {
        // No combination of owner ID and annotation ID.
        // This means that a user is trying to delete an
        // annotation that was written by someone else.
        res.send(403);
      } else {
        res.json(annotations);
      }
    });
  },

  voteup: function(req, res) {
    Annotation.findOne({id: req.param('id')})
    .exec(function(err, annotation) {
      if (err) return _error(err, req, res);
      if (!annotation) return _error('Anotacion no encontrada', req, res);
      Vote.findOne({
        user: req.session.user.id,
        annotation: annotation.id,
      }).exec(function(err, vote) {
        if (err) return _error(err, req, res);
        if (vote) {
          // This user has already voted for this annotation.
          // Check what kind of vote that was.
          if (parseInt(vote.value, 10) > 0) {
            // Trying to vote up again.
            return _error('Error voting up: you cannot vote up more than once', req, res);
          } else {
            // Changing vote from negative to positive.
            vote.value = 1;
            vote.save();
            return res.send(200);
          }
        } else {
          // This user has not voted for this annotation before.
          Vote.create({
            user: req.session.user.id,
            annotation: annotation.id,
            value: 1
          }).exec(function(err, vote) {
            if (err) return _error(err, req, res);
            return res.send(200);
          });
        }
      });
    });
  },

  votedown: function(req, res) {
    Annotation.findOne({id: req.param('id')})
    .exec(function(err, annotation) {
      if (err) return _error(err, req, res);
      if (!annotation) return _error('Anotacion no encontrada', req, res);
      Vote.findOne({
        user: req.session.user.id,
        annotation: annotation.id,
      }).exec(function(err, vote) {
        if (err) return _error(err, req, res);
        if (vote) {
          // This user has already voted for this annotation.
          // Check what kind of vote that was.
          if (parseInt(vote.value, 10) < 0) {
            // Trying to vote down again.
            return _error('Error voting down: you cannot vote down more than once', req, res);
          } else {
            // Changing vote from positive to negative.
            vote.value = -1;
            vote.save();
            return res.send(200);
          }
        } else {
          // This user has not voted for this annotation before.
          Vote.create({
            user: req.session.user.id,
            annotation: annotation.id,
            value: -1
          }).exec(function(err, vote) {
            if (err) return _error(err, req, res);
            return res.send(200);
          });
        }
      });
    });
  },

};
