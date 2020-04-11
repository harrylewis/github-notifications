var githubNotificationIndicator = {
  NOTIFICATIONS_URL: 'https://github.com/notifications/beta',
  REFRESH_IN_MINUTES: 0.1,

  refreshTimers: {},
  activeTabId: undefined,

  init: function() {
    chrome.tabs.query({ url: this.NOTIFICATIONS_URL }, function(tabs) {
      tabs.forEach(this.tabHandler.bind(this));
    }.bind(this));
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler.bind(this));
    chrome.tabs.onUpdated.addListener(this.tabUpdatedHandler.bind(this));
    chrome.tabs.onActivated.addListener(this.tabActivatedHandler.bind(this));
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

  tabUpdatedHandler: function(tabId, changeInfo) {
    var url = changeInfo.url;

    if (!url) return;

    var timer = this.refreshTimers[tabId];

    if (timer) {
      console.log('stop');
      timer.stop();
      delete this.refreshTimers[tabId];

      return;
    }

    if (url != this.NOTIFICATIONS_URL) return;

    var interval = this.minutesInMilliseconds(this.REFRESH_IN_MINUTES);

    this.refreshTimers[tabId] = new this.Timer(function() {
      console.log('tick');
      chrome.tabs.reload(tabId);
    }, interval);
  },

  tabActivatedHandler: function(activeInfo) {
    var previousActiveTabId = this.activeTabId;
    var currentActiveTabId = activeInfo.tabId;
    var previousTimer = this.refreshTimers[previousActiveTabId];
    var currentTimer = this.refreshTimers[currentActiveTabId];

    if (currentTimer) this.stopAllTimers();
    if (previousTimer && !currentTimer) this.restartAllTimers();

    this.activeTabId = activeInfo.tabId;
  },

  stopAllTimers: function() {
    console.log('');
    console.log('Stopping all timers.');
    console.log('');

    var timers = Object.values(this.refreshTimers);

    timers.forEach(function(timer) {
      timer.stop();
    });
  },

  restartAllTimers: function() {
    console.log('');
    console.log('Restarting all timers.');
    console.log('');

    var timers = Object.values(this.refreshTimers);

    timers.forEach(function(timer) {
      timer.reset();
    });
  },
};

githubNotificationIndicator.init();
