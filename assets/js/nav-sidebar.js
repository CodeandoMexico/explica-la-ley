// Helps to create the transition of the nav-bar
// when the sidebar-nav-toggle button is clicked
$(function() {
  $('#sidebar-nav-toggle').on('click', function(event) {
    $('#wrapper').toggleClass('active');
  });
});
