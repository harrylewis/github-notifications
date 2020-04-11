var githubNotificationIndicator = {
  NOTIFICATIONS_URL: 'https://github.com/notifications/beta',
  REFRESH_IN_MINUTES: 0.1,

  refreshTimers: {},

  init: function() {
    chrome.tabs.query({ url: this.NOTIFICATIONS_URL }, function(tabs) {
      tabs.forEach(this.tabHandler.bind(this));
    }.bind(this));
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler.bind(this));
  },

  Timer: function(fn, interval) {
    var timerObject = setInterval(fn, interval);

    this.start = function() {
      if (!timerObject) {
        timerObject = setInterval(fn, interval);
      }

      return this;
    };

    this.stop = function() {
      if (timerObject) {
        clearInterval(timerObject);
        timerObject = null;
      }

      return this;
    };

    this.reset = function() {
      return this.stop().start();
    };
  },

  minutesInMilliseconds: function(minutes) {
    return minutes * 60000;
  },

  tabHandler: function(tab) {
    var tabId = tab.id;
    var interval = this.minutesInMilliseconds(this.REFRESH_IN_MINUTES);

    this.refreshTimers[tabId] = new this.Timer(function() {
      chrome.tabs.reload(tabId);
    }, interval);
  },

  tabRemovedHandler: function(tabId, removeInfo) {
    var timer = this.refreshTimers[tabId];

    if (timer) timer.stop();

    delete this.refreshTimers[tabId];
  },
};

githubNotificationIndicator.init();
