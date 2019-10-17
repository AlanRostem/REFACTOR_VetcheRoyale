import UI from "./UI/UI.js";
import CGameEvent from "./CGameEvent.js";


//TODO:: Make it easier to add Objects that need events
export default class CEventManager {
    constructor() {
        this.events = [];
        this.eventID = [];
        this.eventReceiver = {};
    }

    SGetEvent(client) {
        if (client.inboundPacket) {
            let evs = [];
                    if (client.inboundPacket.gameData){
                        if (client.inboundPacket.gameData.privateEvents) {
                            evs = client.inboundPacket.gameData.privateEvents;
                            for (let e of evs) {
                                let event = new CGameEvent(e);
                                if (event && !this.eventID.includes(event.id)) {
                                    if (e.priority) {
                                        this.events.unshift(event);
                                        this.eventID.unshift(event.id);
                                    } else {
                                        this.events.push(event);
                                        this.eventID.push(event.id);
                                    }
                                }
                            }
                        }
                if (client.inboundPacket.gameData.Event) {
                    evs = client.inboundPacket.gameData.Event;
                    for (let e of evs) {
                        let event = new CGameEvent(e);
                        if (event && !this.eventID.includes(event.id)) {
                            if (e.priority) {
                                this.events.unshift(event);
                                this.eventID.unshift(event.id);
                            } else {
                                this.events.push(event);
                                this.eventID.push(event.id);
                            }
                        }
                    }
                }
            }
        }
    }

    addEventReceiver(key, obj, callback) {
        this.eventReceiver[key] = {obj: obj, callback: callback};
    }


    distributeEvent() {
        for (let key in this.eventReceiver) {
            let e = this.events.filter((ev) => {
                return this.eventReceiver[key].callback(ev) &&
                    (ev.type === "all" || ev.type.includes(key));
            });
            if (e) this.eventReceiver[key].obj.addEvent(e);
        }
    }

    update(client, delaTime) {
        this.SGetEvent(client);
        this.distributeEvent();
        for (var e = 0; e < this.events.length; e++) {
            this.events[e].update(delaTime);
            if (this.events[e].dead) {
                this.eventID.splice(e, 1);
                this.events.splice(e, 1);
            }
        }
    }
}
