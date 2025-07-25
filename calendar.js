document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: ""
    },
    height: 650,
    events: [], // イベントは後から追加 or APIで取得
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
