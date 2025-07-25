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
    events: "https://script.google.com/macros/s/AKfycby09HS0xD2FQOtm0oW3fab8WxtBRAO-UBrhlg6_-iI/exec",
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
