"use strict";

/* Magic Mirror
 * Module: snips-mm2-bridge
 *
 * By Max Bachmann
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
var mqtt = require("mqtt");

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-mqtt started ...");
    this.clients = [];
  },

  getMqtt(notification, payload) {
    var self = this;
    var client = mqtt.connect(payload.options);

    client.on("connect", function() {
      if (payload.notification === "SEND"){
        client.publish(payload.topic, payload.message);
      }else if (payload.notification === "SEND"){
        for (var i = 0; i < payload.topics.length; ++i) {
          client.subscribe(payload.topics[i]);
        }
      }
    });

    client.on("error", function(error) {
      console.log("*** MQTT JS ERROR ***: " + error);
      self.sendSocketNotification("ERROR", {
        type: "notification",
        title: "MQTT Error",
        message: "The MQTT Client has generated an error: " + error
      });
    });

    client.on("offline", function() {
      console.log("*** MQTT Client Offline ***");
      self.sendSocketNotification("ERROR", {
        type: "notification",
        title: "MQTT Offline",
        message: "MQTT Server is offline."
      });
    });

    client.on("message", function(topic, message) {
      self.sendSocketNotification("SnipsBridge", {topic, "message":message.toString()});
    });
  },

  socketNotificationReceived(notification, payload) {

    if (notification === "RECEIVE" || notification === "SEND") {
      this.getMqtt(notification, payload);
    }
  }
});