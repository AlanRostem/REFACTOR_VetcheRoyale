const GameEvent = require("./GameEvent.js");
const STimer = require("../../../../../shared/code/Tools/STimer");

class SEventManager {
    constructor() {
        this.queue = [];
        this.timer = new STimer(4, () => {
            this.add("test" + Math.floor(Math.random() * 100 + 1), "test", {test: "test"});
        });
    }

    add(name, type, arg, priority = false) {
        priority ?
            this.queue.push(new GameEvent(name, type, arg)) :
            this.queue.unshift(new GameEvent(name, type, arg));
    }

    sendEvent(gameWorld) {
        gameWorld.setGameData("Event", undefined);
        if (this.queue.length > 0) {
            let e = this.queue.pop();
            gameWorld.setGameData("Event", e.getEvent());
        }
    }

    update(gameWorld, deltaTime) {
        this.timer.tick(deltaTime);
        this.sendEvent(gameWorld);
    }
}

module.exports = SEventManager;