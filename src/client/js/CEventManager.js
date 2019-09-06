import UI from "./UI/UI.js";

export default class CEventManager {
    constructor() {
        this.events = {};
    }

    SGetEvent(client) {
        if (client.inboundPacket !== undefined)
            if(client.inboundPacket["gameData"]["Event"] !== undefined){
            let e = client.inboundPacket["gameData"]["Event"];
            this.events[e._name] = e;
        }
    }

    distributeEvent() {

    }

    update(client) {
        this.SGetEvent(client);
        if (Object.keys(this.events).length > this.pre) {
            console.log(this.events);
        }
        this.pre = Object.keys(this.events).length;
    }
}