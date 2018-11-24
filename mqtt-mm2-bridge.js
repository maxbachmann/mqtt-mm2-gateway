"use strict";
/* global Module */

/* Magic Mirror
 * Module: snips-mm2-bridge
 *
 * By Max Bachmann
 * MIT Licensed.
 */

Module.register("snips-mm2-bridge", {

  defaults: {
    host: "",
    port: "1883",
    topics: [""],
    username: "",
    password: "",
    key: "",
    cert: "",
    rejectUnauthorized: true,
    ca: ""
  },

  interval: 30000,

  start() {
    Log.info("Starting module: " + this.name);
    this.loaded = false;
    this.updateMqtt(this);
  },

  connectMQTT: function(){
    let options = {
      host: self.config.host, 
      port: self.config.port,
    };
    //tls authentification
    if (self.config.key !== "" 
      && self.config.cert !== ""){
        options.key = self.config.key;
        options.cert = self.config.cert;
        options.rejectUnauthorized = self.config.rejectUnauthorized;
        options.ca = self.config.ca;
    }
    // username + password authentification
    if (self.config.username !== "" && self.config.password !== ""){
        options.username = self.config.username; 
        options.password = self.config.password;
    }
    self.sendSocketNotification("RECEIVE", { 
      options,
      topics : self.config.topics
    });
  },


  updateMqtt(self) {

    connectMQTT();
      
    setTimeout(self.updateMqtt, self.interval, self);
  },

  NotificationReceived(notification, payload) {
    if (notification === "MQTT_MM2_INTERFACE_SEND") {
      this.sendSocketNotification("SEND", payload);
    }
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "SnipsBridge") {
      //this.sendNotification("SHOW_ALERT", notification + "/" + payload.topic);
      this.sendNotification(notification + "/" + payload.topic, payload.data);
    }else if (notification === "ERROR") {
      this.sendNotification("SHOW_ALERT", payload);
    }
  }
});