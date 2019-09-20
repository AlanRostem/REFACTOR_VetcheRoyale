
const SGameEvent = require("./SGameEvent.js");
const STimer = require("../../../../../shared/code/Tools/STimer");

class SEventManager {
    constructor(gameMap) {
        this.queue = [];
        this.timer = new STimer(4, () => {
            this.add("test" + Math.floor(Math.random() * 100), "minimap", "Green", 20,
                {
                    pos: {
                        x:Math.floor(Math.random() * gameMap.w) * gameMap.tileSize,
                        y:Math.floor(Math.random() * gameMap.h) * gameMap.tileSize
                    }
                });
        });

        this.timer2 = new STimer(12, () => {
            this.add("announcement" + Math.floor(Math.random() * 100), "announcement", "Red", 20,
                {
                    string: "announcement"+ Math.floor(Math.random() * 100 ),
                });
        });
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
        this.timer.tick(deltaTime);
        this.timer2.tick(deltaTime);
        this.sendEvent(gameWorld);

    }
}

module.exports = SEventManager;