// Clock that ticks which stores
// a time stamp.

class GameClock {
    constructor(startTime = 0.0) {
        this._currentTime = startTime;
    }

    update(deltaTime) {
        this._currentTime += deltaTime;
    }

    get timeStamp() {
        return this._currentTime;
    }
}

module.exports = GameClock;