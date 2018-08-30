'use strict';

/* Magic Mirror
 * Module: snips-mm2-bridge
 *
 * By Max Bachmann
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var mqtt = require('mqtt');

module.exports = NodeHelper.create({
  start: function() {
    console.log('MMM-mqtt started ...');
    this.clients = [];
  },

  getMqtt: function(payload) {
    var self = this;
    var client = mqtt.connect(payload.mqttServer);

    client.on('connect', function() {
      client.subscribe(payload.topic + '/#');
    });

    client.on('error', function(error) {
      console.log('*** MQTT JS ERROR ***: ' + error);
      self.sendSocketNotification('ERROR', {
        type: 'notification',
        title: 'MQTT Error',
        message: 'The MQTT Client has generated an error: ' + error
      });
    });

    client.on('offline', function() {
      console.log('*** MQTT Client Offline ***');
      self.sendSocketNotification('ERROR', {
        type: 'notification',
        title: 'MQTT Offline',
        message: 'MQTT Server is offline.'
      });
    });

    client.on('message', function(topic, message) {
      const shorttopic = topic.replace(payload.topic,'');
      self.sendSocketNotification('SnipsBridge', {'shorttopic':shorttopic, 'message':message.toString()});
    });
  },

  sendMqtt: function(payload) {
    var self = this;
    var client = mqtt.connect(payload.mqttServer);
    client.on('connect', function() {
      client.publish(payload.topic, payload.message);
    });

    client.on('offline', function() {
      console.log('*** MQTT Client Offline ***');
      self.sendSocketNotification('ERROR', {
        type: 'notification',
        title: 'MQTT Offline',
        message: 'MQTT Server is offline.'
      });
    });
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === 'RECEIVE') {
      this.getMqtt(payload);
    } else if (notification === 'SEND') {
      this.sendMqtt(payload);
    }
  }
});