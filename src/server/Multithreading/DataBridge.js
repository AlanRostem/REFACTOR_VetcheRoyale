const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {
            "events": {},
            /*
            TODO: Make a promise type object that the other data bridge takes data from
             and performs the event callbacks after the promise has resolved it. Do it
             by responding to the other data bridge as soon as it received the data.
             */
            "evtQueue": {}
        };
        this.events = new ONMap();
        this.queuedEvents = new ONMap();
    }

    set receivedData(data) {
        if (!data) return;
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

    onDataReceived(data) {

    }

    update() {
        for (let eventQueueID in this.inboundData.evtQueue) {
            let eventQueue = this.inboundData.evtQueue[eventQueueID];
            for (let eventData of eventQueue) {
                if (this.queuedEvents.has(eventQueueID)) {
                    this.queuedEvents.get(eventQueueID)(eventData);
                }
            }
        }

        this.outboundData = {
            "events": {},
            "evtQueue": {}
        };
    }
}

module.exports = DataBridge;