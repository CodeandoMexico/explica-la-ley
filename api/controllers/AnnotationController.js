/**
 * AnnotationController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {
    Annotation.find({article: req.param('article')})
    .populate('user')
    .populate('voted_by')
    .exec(function(err, annotations) {
      if (err) {
        console.log('Error retreiving annotations:', err);
        return res.send(500);
      }
      // Annotator.js needs this variable to be called 'rows'.
      return res.json({rows: annotations});
    });
  },

  // Creates an annotation for an article
  create: function(req, res) {
    User.findOne({id: req.session.user.id})
    .exec(function(err, user) {
      Annotation.create({
        text: req.param('text'),
        quote: req.param('quote'),
        ranges: req.param('ranges'),
        article: req.param('article'),
        user: user
      })
      .exec(function(err, annotation) {
        if (err) {
          res.send(500);
          console.log('Could not create annotation:',err);
        }
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
      if (err) {
        console.log('Could not update annotation:', err);
        res.send(500);
      }
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
      if (err) {
        console.log('Could not delete annotation:', err);
        res.send(500);
      }
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
      if (typeof annotation === 'undefined') res.send(500);
      Vote.findOne({
        user: req.session.user.id,
        annotation: annotation.id,
      }).exec(function(err, vote) {
        if (vote) {
          // This user has already voted for this annotation.
          // Check what kind of vote that was.
          if (parseInt(vote.value, 10) > 0) {
            // Trying to vote up again.
            console.log('Error voting up: you cannot vote up more than once');
            return res.send(500);
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
            if (err) {
              console.log('Error voting up:', err);
              return res.send(500);
            }
            return res.send(200);
          });
        }
      });
    });
  },

  votedown: function(req, res) {
    Annotation.findOne({id: req.param('id')})
    .exec(function(err, annotation) {
      if (typeof annotation === 'undefined') res.send(500);
      Vote.findOne({
        user: req.session.user.id,
        annotation: annotation.id,
      }).exec(function(err, vote) {
        if (vote) {
          // This user has already voted for this annotation.
          // Check what kind of vote that was.
          if (parseInt(vote.value, 10) < 0) {
            // Trying to vote down again.
            console.log('Error voting down: you cannot vote down more than once');
            return res.send(500);
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
            if (err) {
              console.log('Error voting down:', err);
              return res.send(500);
            }
            return res.send(200);
          });
        }
      });
    });
  },

};
