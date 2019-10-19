// Object that calls a provided function every
// x seconds.

var fixed = (num, fix) => {
    return Number(num.toFixed(fix));
};

export default class Timer {
    constructor(time, callback, loop = true) {
        this._maxTime = fixed(time, 4);
        this._currentTime = 0;
        this._callback = callback;
        this._completed = false;
        this._loop = loop;
    }

    tick(deltaTime) {
        this._currentTime += fixed(deltaTime, 4);
        this._currentTime = fixed(this._currentTime, 4);
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