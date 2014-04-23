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
      // Parse every ranges array, because posgresql saves them as string
      annotations.forEach(function(annotation) {
        annotation.ranges = JSON.parse(annotation.ranges);
      });
      return res.json({rows: annotations});
    });
  },

  // Creates an annotation for an article
  create: function(req, res) {
    Annotation.create({
      text: req.param('text'),
      quote: req.param('quote'),
      ranges: req.param('ranges'),
      article: req.param('article'),
      user: req.session.user
    })
    .exec(function(err, annotation) {
      if (err) {
        res.send(500);
      }
      res.json(annotation);
    })
  },

  update: function(req, res) {
    var id = req.param('id');
    Annotation.update({
      id: id
    },
    {
      text: req.param('text'),
      quote: req.param('quote')
    }).exec(function(err, annotations) {
      if (err) {
        res.send(500);
      }
      res.json(annotations);
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
