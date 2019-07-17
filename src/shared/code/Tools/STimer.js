class STimer {
    constructor(time, callback, loop = true) {
        this._maxTime = time;
        this._currentTime = 0;
        this._callback = callback;
        this._completed = false;
        this._loop = loop;
    }

    tick(deltaTime) {
        this._currentTime += deltaTime;
        if (this._currentTime >= this._maxTime) {
            if (!this._completed) {
                this._callback();
                this._currentTime = 0;
                this._completed = !this._loop;
            }
        }
    }

    reset() {
        this._completed = false;
    }
}

module.exports = STimer;