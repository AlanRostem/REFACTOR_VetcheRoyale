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
        this.clientEvents = new ONMap();
        this.on("clientEvent", data => {
            for (let responseEvent in data) {
                if (this.clientEvents.has(responseEvent)) {
                    for (let clientID in data[responseEvent]) {
                        let clientData = data[responseEvent][clientID];
                        this.clientEvents.get(responseEvent)(clientData);
                    }
                }
            }
        });
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

    transfer(event, data) {
        //if (event === "clientConnectCallback") console.log("clientConnectCallback")
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
        this.clientEvents.set(responseEvent, callback);
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