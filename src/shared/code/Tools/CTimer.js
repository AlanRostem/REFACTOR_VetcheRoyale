// Object that calls a provided function every
// x seconds.
export default class Timer {
    constructor(time, callback, loop = true) {
        this._maxTime = time.toFixed(4);
        this._currentTime = 0;
        this._callback = callback;
        this._completed = false;
        this._loop = loop;
    }

    tick(deltaTime) {
        this._currentTime += deltaTime.toFixed(4);
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