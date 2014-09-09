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
              s += '  <i title="+1" class="fa fa-chevron-up vote-btn-unvoted" onclick="showYouMustLoginFirst();"></i>';
              s += '</span>';
          return s;
        },
        votedown: function(annotationId) {
          var s  = '<span id="vote-down-btn-' + annotationId + '">';
              s += '  <i title="-1" class="fa fa-chevron-down vote-btn-unvoted" onclick="showYouMustLoginFirst();"></i>';
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

function showYouMustLoginFirst() {
  alert('Inicia sesión primero');
}

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
        vote_count_number.innerHTML = n == -1 ? 1 : n+1;
        vote_up_btn.innerHTML = AjaxButtonManager.html.loggedin.voted.voteup(annotationId);
        vote_down_btn.innerHTML = AjaxButtonManager.html.loggedin.unvoted.votedown(annotationId);
        currentUserVotes[annotationId] = +1;
        localAnnotationStore[annotationId].score = localAnnotationStore[annotationId].score == -1 ? 1 : n+1;
      } else if (voteType == 'down') {
        vote_count_number.innerHTML = n == 1 ? -1 : n-1;
        vote_down_btn.innerHTML = AjaxButtonManager.html.loggedin.voted.votedown(annotationId);
        vote_up_btn.innerHTML = AjaxButtonManager.html.loggedin.unvoted.voteup(annotationId);
        currentUserVotes[annotationId] = -1;
        localAnnotationStore[annotationId].score = localAnnotationStore[annotationId].score == 1 ? -1 : n-1;
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
