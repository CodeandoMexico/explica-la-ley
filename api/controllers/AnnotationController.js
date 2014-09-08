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
    .exec(function(err, annotations) {
      if (err) {
        console.log('Error retreiving annotations:', err);
        return res.send(500);
      }
      Annotation.getVoteScores(annotations, function(rows) {
        if (req.session.user) {
          User.getVotes(req.session.user.id, function(votes) {
            return res.json({rows: rows, votes: votes});
          });
        } else {
          return res.json({rows: rows, votes: {}});
        }
      });
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
      if (annotations == []) {
        // No combination of owner ID and annotation ID.
        // This means that a user is trying to update an
        // annotation that was written by someone else.
      } else {
        res.json(annotations);
      }
    });
  },

  destroy: function(req, res) {
    var id = req.param('id');
    Annotation.destroy({
      id: id
    }).exec(function(err) {
      if (err) {
        res.send(500);
      }
      res.json(200);
    });
  },

 /*
  *	Wait for issue #78 to be solved before replacing this code.
  */
  voteup: function(req, res) {
    Annotation.findOne({id: req.param('id')})
    .exec(function(err, annotation) {
      if (typeof annotation === 'undefined') res.send(500);
      Hack.findOne({
        userId: req.session.user.id,
        annotationId: annotation.id,
      }).exec(function(err, hack) {
        if (hack) {
          // This user has already voted for this annotation.
          // Check what kind of vote that was.
          if (parseInt(hack.voteValue, 10) > 0) {
            // Trying to vote up again.
            console.log('Error voting up: you cannot vote up more than once');
            return res.send(500);
          } else {
            // Changing vote from negative to positive.
            hack.voteValue = +1;
            hack.save();
            return res.send(200);
          }
        } else {
          // This user has not voted for this annotation before.
          Hack.create({
            userId: req.session.user.id,
            annotationId: annotation.id,
            voteValue: +1
          }).exec(function(err, hack) {
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

 /*
  *	Wait for issue #78 to be solved before replacing this code.
  */
  votedown: function(req, res) {
    Annotation.findOne({id: req.param('id')})
    .exec(function(err, annotation) {
      if (typeof annotation === 'undefined') res.send(500);
      Hack.findOne({
        userId: req.session.user.id,
        annotationId: annotation.id,
      }).exec(function(err, hack) {
        if (hack) {
          // This user has already voted for this annotation.
          // Check what kind of vote that was.
          if (parseInt(hack.voteValue, 10) < 0) {
            // Trying to vote down again.
            console.log('Error voting down: you cannot vote down more than once');
            return res.send(500);
          } else {
            // Changing vote from positive to negative.
            hack.voteValue = -1;
            hack.save();
            return res.send(200);
          }
        } else {
          // This user has not voted for this annotation before.
          Hack.create({
            userId: req.session.user.id,
            annotationId: annotation.id,
            voteValue: -1
          }).exec(function(err, hack) {
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
