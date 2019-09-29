const SGameEvent = require("./SGameEvent.js");

class SEventManager {
    constructor() {
        this.globalEvents = [];
        this.privateEvents = {};
    }

    addPrivate(player, name, type, color, life, arg, priority = false) {
        let e = new SGameEvent(name, type, arg, color, life, priority);
        if (this.privateEvents[player] === undefined)
            this.privateEvents[player] = [];
        priority ? this.privateEvents[player].push(e)
            : this.privateEvents[player].unshift(e);
    }

    addGlobal(id, type, color, life, arg, priority = false) {
        let e = new SGameEvent(id, type, arg, color, life, priority);
        priority ? this.globalEvents.push(e)
            : this.globalEvents.unshift(e);
    }


    sendEvent(gameWorld) {
        if (this.globalEvents.length > 0)
            gameWorld.setGameData("Event", this.globalEvents);

        for (let player in this.privateEvents)
            if (gameWorld.getEntity(player))
                gameWorld.getEntity(player)._gameData.Event = this.privateEvents[player];

        this.privateEvents = {};
        this.globalEvents = [];
    }

    update(gameWorld, deltaTime) {
        this.sendEvent(gameWorld);
    }
}


module.exports = SEventManager;