// Appends the author's username at the beginning of an annotation
Annotator.Plugin.Author = function (element) {
  // Private API

  // Returns a HTML anchor tag pointed at a twitter profile
  var twitterAnchorTag = function(twitterScreenName, twitterName) {
    var twitterUrl = 'http://twitter.com/' + (twitterScreenName || document.getElementById('sessionUserTwitterScreenName').innerHTML);
    var anchor = '<a href="' + twitterUrl + '" target="_blank">' + (twitterName || document.getElementById('sessionUserTwitterName').innerHTML) + '</a>';
    return anchor;
  },
    // Starts the plugin
    // Loads the Annotation's author
    pluginInit = function() {
      this.annotator.subscribe('annotationViewerTextField', function(field, annotation) {
        if (typeof annotation.user !== 'undefined') {
          $(field).html(twitterAnchorTag(annotation.user.twitterScreenName, annotation.user.name) + ': ' + annotation.text);
        }
      });
  };

  // Public API
  return {
    pluginInit: pluginInit
  };
};
