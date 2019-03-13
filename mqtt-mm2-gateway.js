
Module.register("mqtt-mm2-gateway", {
    // Default module config
    defaults: {
        mqttServers: []
    },

    start: function () {
        console.log(this.name + ' started.');
        console.log(this.name + ': Setting up connection to ' + this.config.mqttServers.length + ' servers');
        this.openMqttConnection();
    },

    openMqttConnection: function () {
        this.sendSocketNotification('MQTT_CONFIG', this.config);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "MQTT_PAYLOAD") {
          Log.info(this.name + " - Received MQTT Message");
          Log.info(this.name + " - topic: " + payload.topic + ", message: " + payload.message);
          this.sendNotification(payload.topic, payload.message);
        } else if (notification === "ERROR") {
          Log.info(this.name + " - " + payload.message);
          this.sendNotification("SHOW_ALERT", payload);
        }
    },
});
  socketNotificationReceived(notification, payload) {
    if (notification === "MM2_SEND") {
      Log.info(this.name + " - Received MQTT Message");
      Log.info(this.name + " - topic: " + payload.topic + ", message: " + payload.message);
      this.sendNotification(payload.topic, {
        message: payload.message,
        serverKey: payload.serverKey,
      });
    }else if (notification === "ERROR") {
      Log.info(this.name + " - " + payload.message);
      this.sendNotification("SHOW_ALERT", payload);
    }
  }
});
