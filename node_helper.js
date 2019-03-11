"use strict";
/**
 * @license
 * Copyright (C) 2019 Max Bachmann
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation, version 3. This program is distributed in the hope 
 * that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see <https://www.gnu.org/licenses/>.
 */
 /**
 * @file gateway for mqtt messages and mm2 notifications
 * @author Max Bachmann <https://github.com/maxbachmann>
 * @version 0.1
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
      if (payload.notification === "MQTT_SEND"){
        console.log("Publishing: " + JSON.stringify(payload.message));
        client.publish(payload.topic, JSON.stringify(payload.message));
      } else {
        for (var i = 0; i < payload.topics.length; ++i) {
          console.log("Subscribing to topics: " + payload.topics.toString());
          client.subscribe(payload.topics[i]);
        }
      }
    });

    client.on("error", function(error) {
      console.log("*** MQTT ERROR ***: " + error);
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
      console.log("Recevied: " + message.toString());
      self.sendSocketNotification("MM2_SEND", {topic, "message": message.toString()});
    });
  },

  socketNotificationReceived(notification, payload) {
    this.getMqtt(notification, payload);
  }
});
