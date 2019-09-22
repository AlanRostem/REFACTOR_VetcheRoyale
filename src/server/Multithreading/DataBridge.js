const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {
            "events": {}
        };
        this.events = new ONMap();
    }

    set receivedData(data) {
        for (let event in data["events"]) {
            let callback = this.events.get(event);
            callback(data["events"][event]);
        }
        this.onDataReceived(data);
        this.inboundData = data;
    }

    transfer(event, data) {
        this.outboundData["events"][event] = data;
    }

    on(event, callback) {
        this.events.set(event, callback);
    }

    queueOutboundData(key, value) {
        this.outboundData[key] = value;
    }

    sendData() {
        return this.outboundData;
    }

    onDataReceived(data) {

    }

    update() {
        this.outboundData = {
            "events": {}
        };
    }

}

module.exports = DataBridge;