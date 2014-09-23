GuiVoteManager = {
  /*
   * Auxiliary variable that holds the current logged-in user's ID.
   */
  currentUserId: document.getElementById('sessionUserId').innerHTML,

  /*
   * Holds the logged-in user's votes on a certain article's annotations.
   * This dictionary has the annotation's ID as the key, and the vote value
   * (which is either -1 or 1) as the value.
   */
  currentUserVotes: {},

  /*
   * Holds the vote score of every annotation in a certain article.
   * This dictionary has the annotation's ID as the key, and the vote score
   * (which is the sum of all the vote values on this annotation) as the value.
   */
  annotationVoteScore: {},

  /*
   * Fills up the "currentUserVotes" dictionary.
   * Fills up the "annotationVoteScore" dictionary.
   * @param {Object} data: Data returned by AnnotationController/index.
   */
  processVotes: function(data) {
    for (i in data.rows) { // Cycle through annotations.
      var annotationId = data.rows[i].id;
      for (j in data.rows[i].voted_by) {
        var userId = data.rows[i].voted_by[j].user;
        var value = parseInt(data.rows[i].voted_by[j].value, 10);

        // This vote belongs to the current logged-in user.
        if (userId == this.currentUserId) {
          this.currentUserVotes[annotationId] = 
            typeof this.currentUserVotes[annotationId] === 'undefined' ?
            (value) : (this.currentUserVotes[annotationId] + value);
        }

        // Count the score for this annotation.
        this.annotationVoteScore[annotationId] =
          typeof this.annotationVoteScore[annotationId] === 'undefined' ?
          (value) : (this.annotationVoteScore[annotationId] + value);
      }
    }
  },    
}
