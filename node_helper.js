"use strict";
/**
 * @file node_helper.js
 * @author Max Bachmann <https://github.com/maxbachmann>
 * @version 0.1
 * @see https://github.com/maxbachmann-magicmirror2/mqtt-mm2-gateway.git
 */

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
 * @external node_helper
 * @see https://github.com/MichMich/MagicMirror/blob/master/modules/node_modules/node_helper/index.js
 */
const NodeHelper = require("node_helper");

/**
 * @external mqtt
 * @see https://github.com/mqttjs/MQTT.js
 */
var mqtt = require("mqtt");

/**
 * @module node_helper
 * @description Backend for the module that acts as MQTT client
 *
 * @requires external:node_helper
 * @requires external:mqtt
 */
module.exports = NodeHelper.create({

  /**
   * @function start
   * @description Logs a start message to the console.
   * @override
   */
  start() {
    console.log("MMM-mqtt started ...");
    this.clients = [];
  },

  /**
   * @function getMQTT
   * @description connect to a mqtt broker with the config parameters from the config
   * @override
   *
   * @param {*} notification 
   * @param {*} config 
   */
  getMQTT(notification, config) {
    var self = this;
    var client = mqtt.connect(config.options);

    // send to message or subscribe to topics on connect
    client.on("connect", function() {
      console.log("Connected to the MQTT broker");
      if (notification === "MQTT_SEND"){
        console.log("Publishing: " + JSON.stringify(config.message));
        client.publish(config.topic, JSON.stringify(config.message));
      } else {
        config.topics.forEach(function(topic){
          console.log("Subscribing to: " + topic);
          client.subscribe(topic);
        });
      }
    });

    // report error
    client.on("error", function(error) {
      console.log("*** MQTT ERROR ***: " + error);
      self.sendSocketNotification("ERROR", {
        type: "notification",
        title: "MQTT Error",
        message: "The MQTT Client has generated an error: " + error
      });
    });

    //report offline
    client.on("offline", function() {
      console.log("*** MQTT Client Offline ***");
      self.sendSocketNotification("ERROR", {
        type: "notification",
        title: "MQTT Offline",
        message: "MQTT Server is offline."
      });
    });

    //forward messages
    client.on("message", function(topic, message) {
      console.log("Received: " + message.toString());
      self.sendSocketNotification("MM2_SEND", {"topic": topic.toString(), "message": message.toString()});
    });
  },

  /**
   * @function socketNotificationReceived
   * @description Handles incoming broadcasts from the module
   * @override
   *
   * @param {*} notification 
   * @param {*} payload 
   */
  socketNotificationReceived(notification, payload) {
    this.getMQTT(notification, payload);
  }
});
