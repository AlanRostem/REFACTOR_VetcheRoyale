class StatTracker {
    constructor(playerID) {
        this._statMap = {
            "Kills": 0,
            "Damage": 0,
            "KnockDowns": 0,
            "Revives": 0,
        }
    }

    getStat(name) {
        return this._statMap[name];
    }

    grantStat(name, value = 1) {
        this._statMap[name] += value;
    }

    grantKill() {
        this.grantStat("Kills");
    }

    grantDamage(value) {
        this.grantStat("Damage", value);
    }

    grantRevive() {
        this.grantStat("Revives")
    }

    grantKnockDown() {
        this.grantStat("KnockDowns");
    }
}

module.exports = StatTracker;