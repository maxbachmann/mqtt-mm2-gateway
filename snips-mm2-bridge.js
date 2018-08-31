'use strict';
/* global Module */

/* Magic Mirror
 * Module: snips-mm2-bridge
 *
 * By Max Bachmann
 * MIT Licensed.
 */

Module.register('snips-mm2-bridge', {

  defaults: {
    mqttServer: ''
  },

  interval: 300,

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.loaded = false;
    this.updateMqtt(this);
  },

  updateMqtt: function(self) {
    self.sendSocketNotification('RECEIVE', { mqttServer : self.config.mqttServer});
    setTimeout(self.updateMqtt, self.interval, self);
  },

  NotificationReceived: function(notification, payload) {
    if (notification === 'SNIPS_MM2_BRIDGE_SEND') {
      this.sendSocketNotification('SEND', payload);
    }
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'SnipsBridge') {
      this.sendNotification(notification + '/' + payload.topic, payload.data);
    }
  }
});