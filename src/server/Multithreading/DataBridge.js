const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {
            "clientEvent": {}
        };
        this.events = new ONMap();
        this.clientEvents = new ONMap();
        /*
        this.on("clientEvent", data => {
            for (let responseEvent in data) {
                if (this.clientEvents.has(responseEvent)) {
                    for (let clientID in data[responseEvent]) {
                        let clientData = data[responseEvent][clientID];
                        this.clientEvents.get(responseEvent)(clientData, clientID);
                    }
                }
            }
        });
         */
    }

    set receivedData(data) {
        if (!data) {
            return;
        }
        this.inboundData = data;

        for (let event in data["clientEvent"]) {
            for (let clientID in data["clientEvent"][event]) {
                let clientData = data["clientEvent"][event][clientID];
                this.clientEvents.get(event)(clientData, clientID);
            }
        }
        this.onDataReceived(data);
    }

    queueOutboundData(key, value) {
        this.outboundData[key] = value;
    }

    transferClientEvent(clientEvent, id, data) {
        if (!this.outboundData.clientEvent[clientEvent]) {
            this.outboundData.clientEvent[clientEvent] = {};
        }
        this.outboundData.clientEvent[clientEvent][id] = data;
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