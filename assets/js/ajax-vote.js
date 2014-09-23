/*
 * Makes the appropriate calls to the back-end whenever a user has decided to
 * vote for an annotation via Annotator.js' popup.
 * @param {int} annotationId: The ID of the annotation that's being voted.
 * @param {String} voteType: It can either be 'up' or 'down' according to the
 *  vote arrow clicked by the user. 
 */
function ajaxVote(annotationId, voteType) {
  var vote_count_number = document.getElementById('vote-count-number-' + annotationId);

  var vote_up_btn = document.getElementById('vote-up-btn-' + annotationId);
  var vote_up_btn_html_aux = vote_up_btn.innerHTML;
  var vote_down_btn = document.getElementById('vote-down-btn-' + annotationId);
  var vote_down_btn_html_aux = vote_down_btn.innerHTML;

  var url = '/annotation/' + annotationId;
  url += voteType == 'up' ? '/voteup' : '/votedown';

  if (voteType == 'up') {
    vote_up_btn.innerHTML = AjaxButtonManager.html.basic.loaderImg;
  } else if (voteType == 'down') {
    vote_down_btn.innerHTML = AjaxButtonManager.html.basic.loaderImg;
  }

  $.ajax({
    url: url,
    method: 'POST',
    contentType: 'application/json', 
    processData: false,
    data: JSON.stringify({
      annotationId: annotationId,
    }),
    success: function() {
      var n = parseInt(vote_count_number.innerHTML, 10)
      if (voteType == 'up') {
        vote_count_number.innerHTML = n == -1 ? (1) : (n + 1);
        vote_up_btn.innerHTML = AjaxButtonManager.html.loggedin.voted.voteup(annotationId);
        vote_down_btn.innerHTML = AjaxButtonManager.html.loggedin.unvoted.votedown(annotationId);
        GuiVoteManager.currentUserVotes[annotationId] = 1;
        GuiVoteManager.annotationVoteScore[annotationId] = GuiVoteManager.annotationVoteScore[annotationId] == -1 ? (1) : (n + 1);
      } else if (voteType == 'down') {
        vote_count_number.innerHTML = n == 1 ? (-1) : (n - 1);
        vote_down_btn.innerHTML = AjaxButtonManager.html.loggedin.voted.votedown(annotationId);
        vote_up_btn.innerHTML = AjaxButtonManager.html.loggedin.unvoted.voteup(annotationId);
        GuiVoteManager.currentUserVotes[annotationId] = -1;
        GuiVoteManager.annotationVoteScore[annotationId] = GuiVoteManager.annotationVoteScore[annotationId] == 1 ? (-1) : (n - 1);
      }
    },
    failure: function(msg) {
      alert('Error al votar. Favor de volver a intentar en unos minutos.');
      alert(msg);
    },
    error: function(xhr, status, text) {
      alert('Error al votar. Favor de volver a intentar en unos minutos.');
      alert(text);
    }
  });
}
