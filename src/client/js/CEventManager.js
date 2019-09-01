import UI from "./UI/UI.js";

export default class CEventManager {
    constructor() {
        this._events = {};
    }

    SGetEvent(client) {
        if (client.inboundPacket !== undefined
            && client.inboundPacket["gameData"]["Event"] !== undefined) {
            let e = client.inboundPacket["gameData"]["Event"];
            this._events[e._name] = e;
        }
    }

    distributeEvent() {

    }

    update(client) {
        this.SGetEvent(client);
        if (Object.keys(this._events).length > this.pre) {
            console.log(this._events);
        }
        this.pre = Object.keys(this._events).length;
    }
}