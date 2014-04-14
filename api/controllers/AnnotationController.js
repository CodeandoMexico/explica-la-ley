/**
 * AnnotationController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {
    Annotation.find({article: req.param('article')}).exec(function(err, annotations) {
      if (err) {
        return res.send(500);
      }
      return res.json({rows: annotations})
    });
  },

  // Creates an annotation for an article
  create: function(req, res) {
    Annotation.create({
      text: req.param('text'),
      quote: req.param('quote'),
      ranges: req.param('ranges'),
      article: req.param('article')
    })
    .exec(function(err, annotation) {
      if (err) {
        res.send(500);
      }
      res.json(annotation);
    })
  }
	
};
