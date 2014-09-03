/**
 * AnnotationController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {
    Annotation.find({article: req.param('article')}).populate('user').exec(function(err, annotations) {
      if (err) {
        return res.send(500);
      }
      return res.json({rows: annotations});
    });
  },

  // Creates an annotation for an article
  create: function(req, res) {
    User.findOne({id: req.session.user.id})
    .exec(function(err, user) {
      // Do NOT use the original "user" object;
      // it might contain sensitive data.
      var user_public_data = {
        id: user.id,
        twitterId: user.twitterId,
        name: user.name,
        twitterScreenName: user.twitterScreenName
      };
      Annotation.create({
        text: req.param('text'),
        quote: req.param('quote'),
        ranges: req.param('ranges'),
        article: req.param('article'),
        user: user_public_data
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
        // TODO: send HTML feedback about this.
        // TODO: prevent the annotation from changing text
        // on a GUI/user-local level. (Perhaps hide the edit
        // button instead?).
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
  }
	
};
