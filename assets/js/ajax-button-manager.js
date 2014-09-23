/*
 * Class in charge of providing the correct HTML ajax buttons and scores.
 * It is merely a repository of HTML code that's easily accessible according
 * to a user's or an annotation's state (loggedin, loggedout, voted, unvoted).
 */
var AjaxButtonManager = {
  html: {
    basic: {
      loaderImg: '<img src="/images/loader.gif" width="12" height="12"/>',
      edit: '<button title="Edit" class="annotator-edit">Edit</button>',
      del: '<button title="Delete" class="annotator-delete">Delete</button>',
      score: function(annotationId, score) {
        return '&nbsp;[<span id="vote-count-number-' + annotationId + '">' + (score || 0) + '</span>]&nbsp;';
      },
    },
    loggedout: {
      unvoted: {
        voteup: function(annotationId) {
          var s  = '<span id="vote-up-btn-' + annotationId + '">';
              s += '  <i title="+1" class="fa fa-chevron-up vote-btn-unvoted" onclick="Annotator.showNotification(\'Inicia sesión antes de votar\', Annotator.Notification.ERROR);"></i>';
              s += '</span>';
          return s;
        },
        votedown: function(annotationId) {
          var s  = '<span id="vote-down-btn-' + annotationId + '">';
              s += '  <i title="-1" class="fa fa-chevron-down vote-btn-unvoted" onclick="Annotator.showNotification(\'Inicia sesión antes de votar\', Annotator.Notification.ERROR);"></i>';
              s += '</span>';
          return s;
        },
      },
    },
    loggedin: {
      unvoted: {
        voteup: function(annotationId) {
          var s  = '<span id="vote-up-btn-' + annotationId + '">';
              s += '  <i title="+1" class="fa fa-chevron-up vote-btn-unvoted" onclick="ajaxVote(' + annotationId + ', \'up\');"></i>';
              s += '</span>';
          return s;
        },
        votedown: function(annotationId) {
          var s  = '<span id="vote-down-btn-' + annotationId + '">';
              s += '  <i title="-1" class="fa fa-chevron-down vote-btn-unvoted" onclick="ajaxVote(' + annotationId + ', \'down\');"></i>';
              s += '</span>';
          return s;
        },
      },
      voted: {
        voteup: function(annotationId) {
          var s  = '<span id="vote-up-btn-' + annotationId + '">';
              s += '  <i title="+1" class="fa fa-chevron-up vote-btn-voted"></i>';
              s += '</span>';
          return s;
        },
        votedown: function(annotationId) {
          var s  = '<span id="vote-down-btn-' + annotationId + '">';
              s += '  <i title="-1" class="fa fa-chevron-down vote-btn-voted"></i>';
              s += '</span>';
          return s;
        }
      },
    },
  },
}
