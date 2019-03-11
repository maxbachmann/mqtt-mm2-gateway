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

Module.register("mqtt-mm2-gateway", {

  defaults: {
    host: 'localhost',
    port: 1883,
    topics: [],
    username: "",
    password: "",
  },

  start() {
    Log.info("Starting module: " + this.name);
    this.start_MQTT_client();
  },

  username_is_set(){
    return this.config.username !== "";
  },

  start_MQTT_client(){
    let options = {
      host: this.config.host,
      port: this.config.port,
    };
    // username + password authentification
    if (this.username_is_set()){
        options.username = this.config.username; 
        options.password = this.config.password;
    }
    this.sendSocketNotification("MQTT_RECEIVE", { 
      options,
      topics : this.config.topics
    });
  },

  NotificationReceived(notification, payload) {
    if (notification === "MQTT_SEND") {
      this.sendSocketNotification("SEND", payload);
    }
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "MM2_SEND") {
      this.sendNotification("SHOW_ALERT", payload);
      this.sendNotification(payload.topic, payload.data);
    }else if (notification === "ERROR") {
      this.sendNotification("SHOW_ALERT", payload);
    }
  }
});
