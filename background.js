var githubNotificationIndicator = {
  TAB_QUERY: { url: 'https://github.com/notifications/beta' },
  REFRESH_IN_MINUTES: 0.1,

  refreshTimers: {},

  init: function() {
    chrome.tabs.query(this.TAB_QUERY, this.tabsHandler);
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler);
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

  tabIds: function() {
    var refreshTimers = githubNotificationIndicator.refreshTimers;

    return Object.keys(refreshTimers).map(function(id) { return parseInt(id) });
  },

  minutesInMilliseconds: function(minutes) {
    return minutes * 60000;
  },

  tabsHandler: function(tabs) {
    var tabHandler = githubNotificationIndicator.tabHandler;

    tabs.forEach(function(tab) {
      tabHandler(tab);
    });
  },

  tabHandler: function(tab) {
    var minutes = githubNotificationIndicator.REFRESH_IN_MINUTES;

    var refreshTimer = setInterval(function() {
      chrome.tabs.reload(tab.id);
    }, githubNotificationIndicator.minutesInMilliseconds(minutes));

    githubNotificationIndicator.refreshTimers[tab.id] = refreshTimer;
  },

  tabRemovedHandler: function(tabId, removeInfo) {
    var tabIds = githubNotificationIndicator.tabIds();
    var refreshTimers = githubNotificationIndicator.refreshTimers;

    if (tabIds.includes(tabId)) {
      var timer = refreshTimers[tabId];

      clearInterval(timer);
      delete githubNotificationIndicator.refreshTimers[tabId];
    }
  },
};

githubNotificationIndicator.init();
