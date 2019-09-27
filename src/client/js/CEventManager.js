import UI from "./UI/UI.js";
import CGameEvent from "./CGameEvent.js";


//TODO:: Make it easier to add Objects that need events
export default class CEventManager {
    constructor() {
        this.events = [];
    }

    SGetEvent(client) {
        if (client.inboundPacket !== undefined) {
            let evs = [];
            if (client.player.output._gameData["Event"] !== undefined) {
                evs = client.player.output._gameData["Event"];
                for (let e of evs)
                    if (e && !this.events.includes(e))
                        e.priority ? this.events.unshift(new CGameEvent(e)) :
                            this.events.push(new CGameEvent(e));

            }

            if (client.inboundPacket["gameData"]["Event"] !== undefined) {
                evs = client.inboundPacket["gameData"]["Event"];
                for (let e of evs)
                    if (e && !this.events.includes(e))
                        e.priority ? this.events.unshift(new CGameEvent(e)) :
                            this.events.push(new CGameEvent(e));
            }
        }
    }

    distributeEvent() {
        try {
            let e = this.events.filter((ev) => {
                return (ev.arg.hasOwnProperty('pos') &&
                    (ev.type === "all" || ev.type.includes("minimap")));
            });
            if (e) UI.elements["minimap"].addEvent(e);

            if (UI.elements["announcement"].event === undefined) {
                let e = this.events.find((ev) => {
                    return (!ev.arg.hasOwnProperty('shown') &&
                        ev.arg.hasOwnProperty('string') &&
                        (ev.type === "all" || ev.type.includes("announcement")));
                });
                if (e) UI.elements["announcement"].addEvent(e);
            }
        } catch (e) {

        }
    }

    update(client, delaTime) {
        this.SGetEvent(client);
        this.distributeEvent();
        for (var e = 0; e < this.events.length; e++) {
            this.events[e].update(delaTime);
            if (this.events[e].dead) this.events.splice(e, 1);
        }
    }
}