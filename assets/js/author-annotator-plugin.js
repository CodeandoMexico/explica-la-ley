// Appends the author's username at the beginning of an annotation
Annotator.Plugin.Author = function (element) {

  // Returns an HTML anchor tag pointed at a twitter profile
  getAuthorAnchorHtml = function(twitterScreenName, twitterName, annotationId) {
    var url = '', anchor = '';
    if (twitterScreenName) {
      // This annotation was already in the database.
      url    += 'http://twitter.com/' + twitterScreenName;
      anchor += '<a id="anchor-' + annotationId + '" href="' + url + '" target="_blank">';
      anchor +=   twitterName.replace(/</g,"&lt;").replace(/>/g,"&gt;");
      anchor += '</a>';
    } else {
      // This annotation has just been created by the logged-in user.
      url    += 'http://twitter.com/' + document.getElementById('sessionUserTwitterScreenName');
      anchor += '<a id="anchor-' + annotationId + '" href="' + url + '" target="_blank">';
      anchor +=   document.getElementById('sessionUserTwitterName').innerHTML.replace(/</g,"&lt;").replace(/>/g,"&gt;");
      anchor += '</a>';
    }
    return anchor;
  },

  // Start the plugin.
  pluginInit = function() {
    this.annotator.subscribe('annotationViewerTextField', function(field, annotation) {
      if (typeof annotation.user !== 'undefined') {
        var authorAnchorHtml = getAuthorAnchorHtml(annotation.user.twitterScreenName, annotation.user.twitterName, annotation.id);
        var text = annotation.text.replace(/</g,"&lt;").replace(/>/g,"&gt;");
        $(field).html(authorAnchorHtml + ': ' + text);

        var authorAnchorDom = document.getElementById('anchor-' + annotation.id);
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
        authorAnchorDom.parentNode.parentNode.children[0].innerHTML = btnsHtml;
        if (annotation.user.role == 'expert') {
          authorAnchorDom.parentNode.style.backgroundColor = '#EDE0BC';
        }
      }
    });
  };

  // Public API
  return {
    pluginInit: pluginInit
  };
};
