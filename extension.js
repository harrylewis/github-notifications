var githubNotificationIndicator = {
  ALERT_FAVICON: `\
    data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJo\
    dHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldm\
    Vub2RkIj48cGF0aCBkPSJNMjcuMDU4IDIzLjA2YTE0LjA0NiAxNC4wNDYgMCAwMS04LjU5NiA4\
    LjIyM2MtLjcuMTQtLjk2Mi0uMjk4LS45NjItLjY2NiAwLS40NzIuMDE3LTEuOTc3LjAxNy0zLj\
    g1IDAtMS4zMTItLjQzNy0yLjE1Mi0uOTQ0LTIuNTkuODExLS4wOSAxLjYzMy0uMjM5IDIuNDA2\
    LS41MDNhMTQuMDg0IDE0LjA4NCAwIDAwOC4wNi0uNjA4ek04LjAwMyA5LjY4Nkw4IDkuOTM3Yy\
    0uODA4LS4yNDctMS4yMjUtLjE2Ny0xLjMwMi0uMTQ4bC0uMDEzLjAwNGMtLjc3IDEuOTI1LS4y\
    OCAzLjM2LS4xNCAzLjcxLS44OTMuOTgtMS40MzUgMi4yNC0xLjQzNSAzLjc2MiAwIDUuMzU1ID\
    MuMjU1IDYuNTYzIDYuMzcgNi45MTItLjQwMi4zNS0uNzcuOTYzLS44OTMgMS44NzMtLjgwNC4z\
    NjctMi44MTcuOTYyLTQuMDc3LTEuMTU1LS4yNjMtLjQyLTEuMDUtMS40NTMtMi4xNTItMS40Mz\
    UtMS4xNzMuMDE3LS40NzMuNjY1LjAxNy45MjcuNTk1LjMzMyAxLjI3NyAxLjU3NSAxLjQzNSAx\
    Ljk3OC4yOC43ODggMS4xOSAyLjI5MyA0LjcwOCAxLjY0NSAwIDEuMTcyLjAxNyAyLjI3NS4wMT\
    cgMi42MDcgMCAuMzY4LS4yNjIuNzg4LS45NjMuNjY1QzQuMDA4IDI5LjQyNyAwIDI0LjE5NSAw\
    IDE4IDAgMTIuMDQ4IDMuNzA5IDYuOTY3IDguOTQzIDQuOTRhMTMuOTM5IDEzLjkzOSAwIDAwLS\
    45NCA0Ljc0N3oiIGZpbGw9IiMyNDI5MkUiLz48cGF0aCBkPSJNMjIgMjBjNS41MjMgMCAxMC00\
    LjQ3NyAxMC0xMFMyNy41MjMgMCAyMiAwIDEyIDQuNDc3IDEyIDEwczQuNDc3IDEwIDEwIDEwei\
    IgZmlsbD0iIzMwNzRFMCIvPjwvZz48L3N2Zz4=\
  `,

  init: function() {
    favicon = this.ALERT_FAVICON;

    if (this.notificationsPresent()) {
      this.faviconLinks().forEach(function(link) {
        link.href = favicon;
      });
    }
  },

  faviconLinks: function() {
    return document.querySelectorAll("link[rel*='icon']");
  },

  notifications: function() {
    return document.getElementsByClassName('notifications-list-item');
  },

  notificationsPresent: function() {
    return this.notifications().length > 0;
  },
};

githubNotificationIndicator.init();
