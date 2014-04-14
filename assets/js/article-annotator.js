jQuery(function($) {
  var article = $('.article').annotator();
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
      article: document.URL.replace(/.*\/(\d+)/, "$1")
    }
  });
});
