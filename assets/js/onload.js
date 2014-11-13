// Actions that need to be executed when the page finishes loading.
// - Manage the live update of notifications
// - Manage flash messages

window.onload = function() {
    showFlash();

    // This should be defined in the /notificaciones page.
    if (typeof markNotificationsAsSeen != 'undefined') {
      markNotificationsAsSeen();
    }

    var dom_navbar_notifications = document.getElementById('navbar-notifications');

    // Get existing unseen notifications.
    $.get("/notificaciones/no_vistas", function(data) {
      if (data.count > 0 ) {
        dom_navbar_notifications.className = 'pure-badge-info';
      }
      dom_navbar_notifications.innerHTML = parseInt(data.count, 10);

      // Listen for new ones.
      var new_notifications = 0;
      io.socket.get('/notificaciones/escucha');
      io.socket.on('new', function(obj){
        new_notifications++;

        // This should be defined in the /notificaciones page.
        if (typeof updateNewNotificationsMsg != 'undefined' ) {
          updateNewNotificationsMsg(new_notifications);
        }

        dom_navbar_notifications.innerHTML = 
          parseInt(dom_navbar_notifications.innerHTML, 10) + 1;

        dom_navbar_notifications.className = 'pure-badge-info';

      }); 

    });

};
