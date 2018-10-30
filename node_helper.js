'use strict';

/* Magic Mirror
 * Module: snips-mm2-bridge
 *
 * By Max Bachmann
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var mqtt = require('mqtt');
const tls = require('tls');

module.exports = NodeHelper.create({
  start: function() {
    console.log('MMM-mqtt started ...');
    this.clients = [];
  },

  getMqtt: function(notification, payload) {
    var self = this;
    var client;

    if (payload.indexOf(TLS)){
      var options = {
        port: payload.port || 8883,
        host: payload.host,
        key: KEY,
        cert: CERT,
        rejectUnauthorized: true,
        // The CA list will be used to determine if server is authorized
        ca: TRUSTED_CA_LIST,
        protocol: 'mqtts'
      }
      
      var client = mqtt.connect(options)
    }else if (payload.indexOf(PW)){
      var options = {
        username: payload.username,
        password: payload.password
      }
      client = mqtt.connect({
        port: payload.port || 1883,
        host: payload.host,
      }, options);
    }else{
      client = mqtt.connect({
        port: payload.port || 1883,
        host: payload.host,
      });
    }
    

    client.on('connect', function() {
      if (payload.indexOf(SEND)){
        client.publish(payload.topic, payload.message);
      }else if (payload.indexOf(RECEIVE)){
        var topics= payload.topics;
        for (var i = 0; i < topics.length; i++) {
          client.subscribe(topics[i]);
        }
      }
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
      self.sendSocketNotification('SnipsBridge', {'topic':topic, 'message':message.toString()});
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
      this.getMqtt(notification, payload);
    } else if (notification === 'SEND') {
      this.sendMqtt(payload);
    }
  }
});