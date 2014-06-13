$(function() {
  $('.clamp-text').each(function(index, element) {
    $clamp(element, {clamp: 5});
  });
  $('.list-boxes p').each(function(index, element) {
    $clamp(element, {clamp: 4});
  });
});
