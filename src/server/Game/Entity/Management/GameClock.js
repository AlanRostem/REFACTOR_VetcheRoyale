// Clock that ticks which stores
// a time stamp.

class GameClock {
    constructor(startTime = 0.0) {
        this._currentTime = startTime;
    }

    update(deltaTime) {
        if (deltaTime < 1) {
            this._currentTime += deltaTime;
        } else {
            console.warn("HIGH THROTTLING");
        }
    }

    get timeStamp() {
        return this._currentTime | 0;
    }
}

module.exports = GameClock;