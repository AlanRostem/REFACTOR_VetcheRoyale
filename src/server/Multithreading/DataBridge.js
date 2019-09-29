const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {
            "clientEvent": {}
        };
        this.events = new ONMap();
        this.clientEvents = new ONMap();
    }

    set receivedData(data) {
        if (!data) {
            return;
        }
        this.inboundData = data;

        try {
            for (let event in data["clientEvent"]) {
                for (let clientID in data["clientEvent"][event]) {
                    let dataQueue = data["clientEvent"][event][clientID];
                    if (this.clientEvents.has(event)) {
                        for (let data of dataQueue) {
                            this.clientEvents.get(event)(data, clientID);
                        }
                    }
                }
            }
            this.onDataReceived(data);
        } catch (e) {
            console.log("DataBridgeError:", e);
        }

    }

    queueOutboundData(key, value) {
        this.outboundData[key] = value;
    }

    transferClientEvent(clientEvent, id, data) {
        if (!this.outboundData.clientEvent[clientEvent]) {
            this.outboundData.clientEvent[clientEvent] = {};
        }
        if (!this.outboundData.clientEvent[clientEvent][id]) {
            this.outboundData.clientEvent[clientEvent][id] = [];
        }
        this.outboundData.clientEvent[clientEvent][id].push(data);
    }

    addClientResponseListener(responseEvent, callback) {
        this.clientEvents.set(responseEvent, callback);
    }

    onDataReceived(data) {

    }

    update() {
        this.outboundData = {
            "clientEvent": {}
        };
    }
}

module.exports = DataBridge;