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
    mqttServer: '',
    topic : ''
  },

  interval: 300,

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.loaded = false;
    this.updateMqtt(this);
  },

  updateMqtt: function(self) {
    self.sendSocketNotification('RECEIVE', { mqttServer : self.config.mqttServer, topic : self.config.topic});
    setTimeout(self.updateMqtt, self.interval, self);
  },

  NotificationReceived: function(notification, payload) {
    if (notification === 'SNIPS_MM2_BRIDGE_SEND') {
      this.sendSocketNotification('SEND', { mqttServer : self.config.mqttServer, topic : payload.topic, message : payload.message});
    }
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'SnipsBridge') {
      this.SocketNotification(notification + payload.topic, payload.message);
    }
  }
});