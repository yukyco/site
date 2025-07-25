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
      fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLinSHc5qwo7PjMvwnw5K4FDT2r6Z2g9-uYz9ofZ7hLvRGbDNiRhL93D612QnBJlGextkfeCzEyMGqVgAEcUg8Uim4idMVI2H-e8sykr2VhsILQjtId-XbpLIZD7dalGid71GQ8bXRz61osOkb-dyhMppNh65Hq4QP0Llq5kdsqDbqyPxWRtXMpJKz5TP60Gh__BkodSDakvaPd1ZnZ4McLG5Iy7knjBbbPoCzSsN8RYm-pOhU3I2A0QkRt-KWkPSkvyu1DrmDFXOJO4wsUiHSMxlClUKA&lib=MJOA-7YaR8l95WuLF8bv3hnQa-NNQ1Z9i")
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
