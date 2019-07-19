class StatTracker {
    constructor(playerID) {
        this._kills = 0;
        this._damage = 0;
        this._revives = 0;
    }

    grantKill() {
        this._kills++;
        console.log("Granted kill! Kills:", this._kills);
    }

    grantDamage(value) {
        this._damage += value;
    }

    granRevive() {
        this._revives++;
    }
}

module.exports = StatTracker;