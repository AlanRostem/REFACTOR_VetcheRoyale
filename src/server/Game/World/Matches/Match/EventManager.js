const GameEvent = require("./GameEvent.js");
const STimer = require("../../../../../shared/code/Tools/STimer");

class EventManager {
    constructor() {
        this._queue = [];
        this._timer = new STimer(4, () => {
            this.add("test", "test", {test: "test"});
        });
    }

    add(name, type, arg, priority = false) {
        priority ?
            this._queue.push(new GameEvent(name, type, arg)) :
            this._queue.unshift(new GameEvent(name, type, arg));
    }

    sendEvent(gameWorld) {
        gameWorld.setGameData("Event", null);
        if (this._queue.length > 0) {
            let e = this._queue.pop();
            gameWorld.setGameData("Event", e.getEvent());
        }
    }

    update(gameWorld, deltaTime) {
        this._timer.tick(deltaTime);
        this.sendEvent(gameWorld);
    }
}

module.exports = EventManager;