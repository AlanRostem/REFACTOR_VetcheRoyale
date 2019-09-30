const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridgeV2 {
    constructor(messagePort) {
        this.messagePort = messagePort;
        this.messagePort.on("message", this.onMessageReceived.bind(this));
        this.events = new ONMap()
    }

    addEventListener(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    onMessageReceived(message) {

    }

    emitMessage(eventName, message) {
        this.messagePort.postMessage({
            [eventName]: message
        });
    }
}

module.exports = DataBridgeV2;