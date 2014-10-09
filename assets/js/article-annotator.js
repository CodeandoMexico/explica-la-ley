jQuery(function($) {
  // Matches the url of a document, puts a match group at the :id
  var article = $('.article').annotator();
  // Avoid this hackery by loading this script only when viewing articles.
  var articleIdDomObj = document.getElementById('articleId') || {innerHTML: -1};

  article.annotator('addPlugin', 'Store', {
    prefix: '/storage',
    urls: {
      create:   '/annotation',
      read:     '/annotation/:id',
      update:   '/annotation/:id',
      destroy:  '/annotation/:id',
      search:   '/annotation'
    },

    // Sent to the backend when saving an annotation.
    annotationData: {
      article: articleIdDomObj.innerHTML,
    },

    // Used to load annotations within an article's view.
    loadFromSearch: {
      article: articleIdDomObj.innerHTML,
    }
  });

  article.annotator('addPlugin', 'Author');

});
