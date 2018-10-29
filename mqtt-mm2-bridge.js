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
    topics: [''],
    username: '',
    password: '',
    tlsKey: '',
    selfsignedTLS: true 
  },

  interval: 30000,

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.loaded = false;
    this.updateMqtt(this);
  },

  updateMqtt: function(self) {
    if (self.config.tlsKey === ''){

       if (self.config.username != '' && self.config.password != ''){
         self.sendSocketNotification('RECEIVE_PW', { mqttServer : self.config.mqttServer, 
                    topics : self.config.topics, 
                    username : self.config.username, 
                    password : self.config.password});
       }else{
         self.sendSocketNotification('RECEIVE', { mqttServer : self.config.mqttServer, topics : self.config.topics});
       }
    }else{
      self.sendSocketNotification('RECEIVE_TLS', { mqttServer : self.config.mqttServer, 
                    topics : self.config.topics, 
                    tlsKey : self.config.tlsKey, 
                    selfsignedTLS : self.config.selfsignedTLS});
    }
    
    setTimeout(self.updateMqtt, self.interval, self);
  },

  NotificationReceived: function(notification, payload) {
    if (notification === 'MQTT_MM2_INTERFACE_SEND') {
      this.sendSocketNotification('SEND', payload);
    }
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'SnipsBridge') {
      this.sendNotification('SHOW_ALERT', notification + '/' + payload.topic);
      this.sendNotification(notification + '/' + payload.topic, payload.data);
    }else if (notification === 'ERROR') {
      this.sendNotification('SHOW_ALERT', payload);
    }
  }
});