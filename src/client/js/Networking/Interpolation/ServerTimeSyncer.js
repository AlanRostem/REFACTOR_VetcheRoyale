

Math.clamp = function (a, b, c) {
    return Math.max(b, Math.min(c, a));
};

export default class ServerTimeSyncer {

    constructor() {
        this.integrator = 0;
        this.totalDrift = 0;
        this.serverTicks = 0;
        this.startTime = this.getNow();
        this.expectedTime = this.getNow() + ServerTimeSyncer.SERVER_STEP_MS;
        this.simulationTime = 0;
    }

    get ping() {
        return this._latency;
    }

    onServerUpdate(ping) {
        this._latency = ping;
        this.serverTicks++;
        var timeDifference = this.expectedTime - this.getNow();
        this.integrator = this.integrator * 0.9 + timeDifference;

        var adjustment = Math.clamp(this.integrator * 0.01, -0.1, 0.1);
        this.totalDrift += adjustment;
        this.expectedTime += ServerTimeSyncer.SERVER_STEP_MS;
    }

    getNow() {
        return Date.now() + this.totalDrift;
    }

    moveSimulation() {
        if (this.getNow() - this.simulationTime > ServerTimeSyncer.STEP_MS) {
            this.simulationTime += ServerTimeSyncer.STEP_MS;
            return true; //did step
        }
        return false; //did not step
    }

    serverDelta(delta) {
        return this.serverTicks * ServerTimeSyncer.SERVER_STEP_MS - delta;
    }

    timeSinceStart() {
        return this.getNow() - this.startTime;
    }

}
ServerTimeSyncer.SERVER_STEP_MS = 100; // Time offset of 100ms
ServerTimeSyncer.STEP_MS = 16;