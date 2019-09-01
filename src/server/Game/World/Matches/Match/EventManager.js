const GameEvent = require("./GameEvent.js");

class EventManager {
    constructor() {
        this._queue = [];
    }

    add(name, type, arg, priority = false) {
        priority ?
            this._queue.push(new GameEvent(name, type, arg)):
            this._queue.unshift(new GameEvent(name, type, arg));
    }

    sendEvent(gameWorld){
        if (this._queue.length > 0) {
            let e = this._queue.pop();
            gameWorld.setGameData(e._name, e.getEvent());
        }
    }

    update(gameWorld) {
        this.sendEvent(gameWorld);
    }
}

module.exports = EventManager;