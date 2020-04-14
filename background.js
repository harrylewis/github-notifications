var githubNotificationIndicator = {
  NOTIFICATIONS_URL: 'https://github.com/notifications/beta',
  REFRESH_IN_MILLISECONDS: 6000,

  refreshTimers: {},
  activeTabId: undefined,

  init: function() {
    /* chrome.tabs.query({ url: this.NOTIFICATIONS_URL }, function(tabs) { */
    /*   tabs.forEach(this.tabHandler.bind(this)); */
    /* }.bind(this)); */
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler.bind(this));
    chrome.tabs.onUpdated.addListener(this.tabUpdatedHandler.bind(this));
    chrome.tabs.onActivated.addListener(this.tabActivatedHandler.bind(this));
    chrome.tabs.onCreated.addListener(this.tabCreatedHandler.bind(this));

    this.machine = new this.Machine(this);
    this.machine.setup();
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

  Machine: function(context) {
    var STATE_SETUP = 'state_setup';
    var STATE_RUNNING = 'state_running';
    var STATE_STOPPED = 'state_stopped';
    var state = STATE_SETUP;

    this.INPUT_CREATED = 'input_created';
    this.INPUT_UPDATED = 'input_updated';
    this.INPUT_REMOVED = 'input_removed';
    this.INPUT_ACTIVATED = 'input_activated';

    var TARGET_URL = 'https://github.com/notifications/beta';

    var addTimer = context.addTimer.bind(context);
    var restartTimers = context.restartTimers.bind(context);
    var stopTimers = context.stopTimers.bind(context);

    this.setup = function() {
      var targetContext = false;

      chrome.tabs.query({ url: TARGET_URL }, function(tabs) {
        tabs.forEach(function(tab) {
          if (tab.active) targetContext = true;

          addTimer(tab.id);
        });

        this.transition('', targetContext);
      }.bind(this));
    };

    this.transition = function(input, targetContext, tabId) {
      switch (state) {
        case STATE_SETUP:
          if (targetContext) {
            stopTimers();
          } else {
            restartTimers();
          }

          state = targetContext ? STATE_STOPPED : STATE_RUNNING;

          break;
        case STATE_RUNNING:
          
          break;
        case STATE_STOPPED:
          break;
      }

      console.log(state);

      return this;
    };
  },

  tabHandler: function(tab) {
    var tabId = tab.id;
    var interval = this.REFRESH_IN_MILLISECONDS;

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

    var interval = this.REFRESH_IN_MILLISECONDS;

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

    if (currentTimer) this.stopTimers();
    if (previousTimer && !currentTimer) this.restartTimers();

    this.activeTabId = activeInfo.tabId;
  },

  tabCreatedHandler: function(tab) {
    console.log('--------------------');
    console.log('New tab created.');
  },

  addTimer: function(tabId) {
    console.log('--------------------');
    console.log('New timer created for tab ID:' + tabId + '.');

    var interval = this.REFRESH_IN_MILLISECONDS;
    var timer = new this.Timer(function() {
      console.log('--------------------');
      console.log('Tick:' + tabId + '.');
      chrome.tabs.reload(tabId);
    }, interval);

    this.refreshTimers[tabId] = timer.stop();
  },

  removeTimer: function(tabId) {
    console.log('--------------------');
    console.log('Timer removed for tab ID:' + tabId + '.');

    var timer = this.refreshTimers[tabId];

    if (timer) timer.stop();

    delete this.refreshTimers[tabId];
  },

  stopTimers: function() {
    console.log('--------------------');
    console.log('Stopping all timers.');

    var timers = Object.values(this.refreshTimers);

    timers.forEach(function(timer) {
      timer.stop();
    });
  },

  restartTimers: function() {
    console.log('--------------------');
    console.log('Restarting all timers.');

    var timers = Object.values(this.refreshTimers);

    timers.forEach(function(timer) {
      timer.reset();
    });
  },
};

githubNotificationIndicator.init();
