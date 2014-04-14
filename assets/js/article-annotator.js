jQuery(function($) {
  // Matches the url of a document, puts a match group at the :id
  var regex = /.*\/(\d+)/,
      article = $('.article').annotator();

  article.annotator('addPlugin', 'Store', {
    prefix: '/storage',
    urls: {
      create:   '/annotation',
      read:     '/annotation/:id',
      update:   '/annotation/:id',
      destroy:  '/annotation/:id',
      search:   '/annotation'
    },
    annotationData: {
      article: document.URL.replace(regex, "$1")
    },
    loadFromSearch: {
      article: document.URL.replace(regex, "$1")
    }
  });

});
