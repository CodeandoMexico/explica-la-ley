// Appends the author's username at the beginning of an annotation
Annotator.Plugin.Author = function (element) {
  // Private API

  // Returns a HTML anchor tag pointed at a twitter profile
  var twitterAnchorTag = function(twitterProfile, username) {
    var twitterUrl = 'http://twitter.com/' + twitterProfile;
    var anchor = '<a href="' + twitterUrl + '" target="_blank">' + username + '</a>';
    return anchor;
  },
    // Starts the plugin
    // Loads the Annotation's author
    pluginInit = function() {
      this.annotator.subscribe('annotationViewerTextField', function(field, annotation) {
        var annotationText = annotation.text;
        var annotationUsername = '';
        if (typeof annotation.user !== 'undefined') {
          annotationUsername = annotation.user.username;
          annotationTwitterProfile = annotation.user.twitterProfile;
        }
        if (annotationUsername !== '') {
          $(field).html(twitterAnchorTag(annotationTwitterProfile, annotationUsername) + ': ' + annotationText);
        }
      });
  };

  // Public API
  return {
    pluginInit: pluginInit
  };
};
