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
        gameWorld.setGameData("Event", undefined);
        if (this.queue.length > 0) {
            let e = this.queue.pop();
            gameWorld.setGameData("Event", e.getEvent());
        }
    }

    update(gameWorld, deltaTime) {
        this.sendEvent(gameWorld);
    }
}

module.exports = SEventManager;