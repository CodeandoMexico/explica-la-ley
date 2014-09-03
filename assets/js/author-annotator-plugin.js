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
          $(field).html(twitterAnchorTag(annotation.user.twitterScreenName, annotation.user.twitterName) + ': ' + annotation.text);
          if (document.getElementById('sessionUserId').innerHTML == annotation.user.id) {
            // The logged-in user is the author of this annotation.
            // Show the edit/delete buttons.
            var btnsHtml = '<button title="Edit" class="annotator-edit">Edit</button><button title="Delete" class="annotator-delete">Delete</button>';
            document.getElementById('annotator-action-btns').innerHTML = btnsHtml;
          } else {
            // The viewing user is not logged-in nor the author of this annotation.
            // Show the vote up/down buttons.
            btnsHtml = '<i class="glyphicon glyphicon-chevron-down"></i> [ x ] <i class="glyphicon glyphicon-chevron-up"></i>';
            document.getElementById('annotator-action-btns').innerHTML = btnsHtml;
          }
        }
      });
  };

  // Public API
  return {
    pluginInit: pluginInit
  };
};
