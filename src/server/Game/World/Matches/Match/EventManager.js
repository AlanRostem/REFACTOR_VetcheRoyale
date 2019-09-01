const GameEvent = require("./GameEvent.js");

class EventManager {
    constructor() {
        this._queue = [];
    }

    add(name, type, pos = undefined, priority = false) {
        priority ?
            this._queue.push(new GameEvent(name, type, pos)):
            this._queue.unshift(new GameEvent(name, type, pos));
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