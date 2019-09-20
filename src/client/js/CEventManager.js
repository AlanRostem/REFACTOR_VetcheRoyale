import UI from "./UI/UI.js";
import CGameEvent from "./CGameEvent.js";

export default class CEventManager {
    constructor() {
        this.events = [];
    }

    SGetEvent(client) {
        if (client.inboundPacket !== undefined)
            if(client.inboundPacket["gameData"]["Event"] !== undefined) {
                let e = client.inboundPacket["gameData"]["Event"];
                this.events.push(new CGameEvent(e.name, e.type, e.arg, e.color, e.life));
            }
    }

    distributeEvent() {
        if (this.events.length > 0) {

            UI.elements["minimap"].addEvent(this.events.filter((ev) => {
                return (ev.type === "all" || ev.type.includes("minimap"));
            }));

            if (UI.elements["announcement"].event === undefined) {
                UI.elements["announcement"].addEvent(this.events.find((ev) => {
                    return (!ev.hasOwnProperty('shown') && (ev.type === "all" || ev.type.includes("announcement")));
                }));
            }

        }
    }

    update(client, delaTime) {
        this.SGetEvent(client);
        for (var e = 0; e < this.events.length; e++){
            this.events[e].update(delaTime);
            if (this.events[e].dead) this.events.splice(e, 1);
        }
        this.distributeEvent();
    }
}