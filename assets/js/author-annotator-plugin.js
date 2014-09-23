// Appends the author's username at the beginning of an annotation
Annotator.Plugin.Author = function (element) {
  // Private API

  // Returns a HTML anchor tag pointed at a twitter profile
  var twitterAnchorTag = function(twitterScreenName, twitterName, annotationId) {
    var twitterUrl = 'http://twitter.com/' + (twitterScreenName || document.getElementById('sessionUserTwitterScreenName').innerHTML);
    var anchor = '<a id="anchor-' + annotationId + '" href="' + twitterUrl + '" target="_blank">' + (twitterName || document.getElementById('sessionUserTwitterName').innerHTML) + '</a>';
    return anchor;
  },

  // Starts the plugin.
  pluginInit = function() {
    this.annotator.subscribe('annotationViewerTextField', function(field, annotation) {
      if (typeof annotation.user !== 'undefined') {
        $(field).html(twitterAnchorTag(annotation.user.twitterScreenName, annotation.user.twitterName, annotation.id) + ': ' + annotation.text);
        var twitterAnchor = document.getElementById('anchor-' + annotation.id);
        var btnsHtml = '';
        btnsHtml += '<span id="vote-btns-' + annotation.id + '">';
        if (document.getElementById('sessionUserId').innerHTML == '') {
          // The user is not logged in.
          btnsHtml += AjaxButtonManager.html.loggedout.unvoted.votedown(annotation.id);
          btnsHtml += AjaxButtonManager.html.loggedout.unvoted.voteup(annotation.id);
        } else {
          if (document.getElementById('sessionUserId').innerHTML == annotation.user.id) {
            // The logged-in user is the author of this annotation.
            btnsHtml += AjaxButtonManager.html.basic.edit;
            btnsHtml += AjaxButtonManager.html.basic.del;
          } else {
            // The logged-in user is not the author of this annotation.
            if (GuiVoteManager.currentUserVotes[annotation.id] > 0) {
              // The user has already voted this annotation up and can only vote it down.
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.votedown(annotation.id);
              btnsHtml += AjaxButtonManager.html.loggedin.voted.voteup(annotation.id);
            }
            if (GuiVoteManager.currentUserVotes[annotation.id] < 0) {
              // The user has already voted this annotation down and can only vote it up.
              btnsHtml += AjaxButtonManager.html.loggedin.voted.votedown(annotation.id);
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.voteup(annotation.id);
            }
            if (typeof GuiVoteManager.currentUserVotes[annotation.id] === 'undefined') {
              // The user has not voted for this annotation.
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.votedown(annotation.id);
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.voteup(annotation.id);
            }
          }
        }
        btnsHtml += AjaxButtonManager.html.basic.score(annotation.id, GuiVoteManager.annotationVoteScore[annotation.id]);
        btnsHtml += '</span>';

        // This element holds the actual action buttons, which need to be
        // modified on-the-fly according to the user/annotation's state.
        twitterAnchor.parentNode.parentNode.children[0].innerHTML = btnsHtml;
      }
    });
  };

  // Public API
  return {
    pluginInit: pluginInit
  };
};
