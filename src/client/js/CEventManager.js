import UI from "./UI/UI.js";

export default class CEventManager {
    constructor() {
        this._events = [];
    }

    SGetEvent(client) {
        if (client.inboundPacket !== undefined
            && client.inboundPacket["gameData"]["Event"] !== undefined)
            this._queue.unshift(client.inboundPacket["gameData"]["Event"]);
    }

    distributeEvent() {

    }


    update(client) {
        this.SGetEvent(client);
        if (this._events.length > 0) {
            this.distributeEvent();
        }
    }
}