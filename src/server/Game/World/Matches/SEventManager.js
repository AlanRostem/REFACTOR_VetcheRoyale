const SGameEvent = require("./SGameEvent.js");

class SEventManager {
    constructor() {
        this.queue = [];
    }

    add(name, type, color, life, arg, priority = false) {
        let e = new SGameEvent(name, type, arg, color, life);
        priority ? this.queue.push(e) : this.queue.unshift(e);
    }

    sendEvent(gameWorld) {
        if (this.queue.length > 0) {
            let e = this.queue.pop();
            if (e.arg.hasOwnProperty("player")) {
                gameWorld.clients.getClient(e.arg.player).player._gameData.Event = e.getEvent();
            } else
                gameWorld.setGameData("Event", e.getEvent());
        }
    }

    update(gameWorld, deltaTime) {
        this.sendEvent(gameWorld);
    }
}


module.exports = SEventManager;