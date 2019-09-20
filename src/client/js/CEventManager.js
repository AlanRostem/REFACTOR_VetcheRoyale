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
                this.events.push(new CGameEvent(e.name, e.type, e.arg, e.life));
            }
    }

    distributeEvent() {
        try {
            if(this.events.length > 0) {
                let e = this.events.pop();
                if (UI.elements['announcement'].elm === undefined)
                    UI.elements['announcement'].addEvent(e);
                UI.elements['minimap'].addEvent(e);
                this.events.push(e);
            }
        }catch (e) {
            
        }
    }

    update(client, delaTime) {
        this.SGetEvent(client);
      /*  for (var e = 0; e < this.events.length; e++){
            this.events[e].update(delaTime);
            if (this.events[e].dead) delete this.events.splice(e, 1);
        }
*/

        this.distributeEvent();
    }
}