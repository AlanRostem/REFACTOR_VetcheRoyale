const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {
            "events": {},
            "asyncs": {}
        };
        this.events = new ONMap();
        this.asyncs = new ONMap();
    }

    set receivedData(data) {
        this.inboundData = data;
        for (let event in data["events"]) {
            let callback = this.events.get(event);
            if (callback)
                callback(data["events"][event]);
        }
        this.onDataReceived(data);
    }

    asyncEmit(event, data) {
        this.outboundData["asyncs"][event] = data;
    }

    onAsync(event, callback) {
        this.asyncs.set(event, callback)
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
        for (let event in this.outboundData["asyncs"]) {
            let callback = this.asyncs.get(event);
            if (callback) {
                callback(this.outboundData["asyncs"][event]);
                delete this.outboundData.asyncs[event];
            }
        }
        this.outboundData = {
            "events": {},
            "asyncs": this.outboundData.asyncs
        };
    }

}

module.exports = DataBridge;