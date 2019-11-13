const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor(messagePort) {
        this.messagePort = messagePort;
        this.messagePort.on("message", this.onMessageReceived.bind(this));
        this.events = new ONMap();
    }

    addEventListener(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    onMessageReceived(message) {
        for (let eventName in message) {
            if (this.events.has(eventName)) {
                for (let callback of this.events.get(eventName)) {
                    callback(message[eventName]);
                }
            }
        }
    }

    emitMessage(eventName, message) {
        this.messagePort.postMessage({
            [eventName]: message
        });
    }

    // TODO: Refactor away these wrapper functions
    addClientResponseListener(responseEvent, callback) {
        this.addEventListener(responseEvent, callback);
    }

    transferClientEvent(clientEvent, id, data) {
        this.emitMessage(clientEvent, {
            id: id,
            data: data
        });
    }
}

module.exports = DataBridge;