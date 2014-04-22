$(function() {
  var filter = function() {
    $('#filter').keyup(function() {

      // Retrieve input field text and set a regexp
      var filter = $(this).val(),
          regex = new RegExp(filter, "i");

      if (!filter) {
        // Show all, there is no filter
        $('.articles-list li').show();
        return;
      }

      // Iterate the articles list
      $('.articles-list li').each(function() {
        var $this = $(this);
        // If the list item doesn't match the regex hide it
        if ($this.text().search(regex) < 0) {
          $this.hide();
        } else {
          $this.show();
        }
      });

    });
  },

  loadArticles = function(callback) {
    $.get('/article', function(articles) {
      console.dir(articles);
      var listElements = '';
      articles.forEach(function(article) {
        listElements += '<li><a href="/article/' + article.id + '">Art&iacute;culo ' + article.number + '</a></li>';
      });
      $('.articles-list').append(listElements);
      callback();
    });
  },

  init = function() {
    loadArticles(filter);
  };

  init();
});
