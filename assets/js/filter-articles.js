$(function() {
  $('#filter').keyup(function() {

    // Retrieve input field text and set a regexp
    var filter = $(this).val(),
        regex = new RegExp(filter, "i");

    if (!filter) {
      // Show all, there is no filter
      $('.card-listing li').show();
      return;
    }

    // Iterate the articles list
    $('.card').each(function() {
      var $this = $(this),
          $title = $('.card-title', $this);
      // If the list item doesn't match the regex hide it
      if ($title.text().search(regex) < 0) {
        $this.hide();
      } else {
        $this.show();
      }
    });

  });

});
