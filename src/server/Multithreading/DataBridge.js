const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {
            "events": {
                "clientEvent": {}
            },
        };
        this.events = new ONMap();
        this.queuedEvents = new ONMap();
    }

    set receivedData(data) {
        if (!data) {
            return;
        }
        this.inboundData = data;
        for (let event in data["events"]) {
            let callback = this.events.get(event);
            if (callback)
                callback(data["events"][event]);
        }
        this.onDataReceived(data);
    }

    queueEventData(event, data) {
        if (this.outboundData.evtQueue.hasOwnProperty(event)) {
            this.outboundData.evtQueue[event].push(data);
            return;
        }
        this.outboundData.evtQueue[event] = [data];
    }

    onQueuedEvent(event, callback) {
        this.queuedEvents.set(event, callback);
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

    transferClientEvent(clientEvent, id, data) {
        if (!this.outboundData.events.clientEvent[clientEvent]) {
            this.outboundData.events.clientEvent[clientEvent] = {};
        }
        this.outboundData.events.clientEvent[clientEvent][id] = data;
    }

    addClientResponseListener(responseEvent, callback) {
        this.on("clientEvent", data => {
            for (let clientID in data[responseEvent]) {
                let clientData = data[responseEvent][clientID ];
                callback(clientData);
            }
        });
    }

    onDataReceived(data) {

    }

    update() {
        this.outboundData = {
            "events": {
                "clientEvent": {}
            }
        };
    }
}

module.exports = DataBridge;