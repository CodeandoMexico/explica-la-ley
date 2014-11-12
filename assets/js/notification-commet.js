// Manages the live update of the front-end whenever there's
// notification activity in the back-end.
window.onload = function processNotifications(){
    var dom_navbar_notifications = document.getElementById('navbar-notifications');

    // Get existing unseen notifications.
    $.get("/notificaciones/no_vistas", function(data) {
      dom_navbar_notifications.innerHTML = data.count;

      // Listen for new ones.
      var new_notifications = 0;
      io.socket.get('/notificaciones/escucha');
      io.socket.on('new', function(obj){
        new_notifications++;

        // This should be defined in the /notificaciones page.
        if (updateNewNotificationsMsg) updateNewNotificationsMsg(new_notifications);

        dom_navbar_notifications.innerHTML = parseInt(data.count, 10) + new_notifications;
      }); 

    });

    // This should be defined in the /notificaciones page.
    if (markNotificationsAsSeen) markNotificationsAsSeen();
};
