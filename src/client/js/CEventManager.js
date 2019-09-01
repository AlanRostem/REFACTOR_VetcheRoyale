import UI from "./UI/UI.js";

export default class CEventManager {
    constructor() {
        this._events = [];
    }

    SGetEvent(client) {
        if (client.inboundPacket !== undefined
            && client.inboundPacket["gameData"]["Event"] !== undefined) {
            this._events.unshift(client.inboundPacket["gameData"]["Event"]);
        }
    }

    distributeEvent() {

    }

    update(client) {
        this.SGetEvent(client);
        if (this._events.length > this.pre) {
            console.log(this._events);
        }
        this.pre = this._events.length;
    }
}