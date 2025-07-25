document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    height: 650,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: ""
    },
    events: function(fetchInfo, successCallback, failureCallback) {
      fetch("https://script.google.com/macros/s/1_dOaqHwCJpzah-J5p-9mub85xwntFBJPGf0PEI5u5qQ/exec")
        .then(response => response.json())
        .then(data => {
          const events = data.map(item => ({
            title: item.status,
            start: item.date,
            extendedProps: {
              reason: item.reason
            }
          }));
          successCallback(events);
        })
        .catch(error => {
          console.error("エラー:", error);
          failureCallback(error);
        });
    },
    eventDidMount: function(info) {
      if (info.event.extendedProps.reason) {
        new bootstrap.Tooltip(info.el, {
          title: info.event.extendedProps.reason,
          placement: 'top',
          trigger: 'hover',
          container: 'body'
        });
      }
    }
  });

  calendar.render();
});
