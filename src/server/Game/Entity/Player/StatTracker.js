// Tracks all stats of the player.
class StatTracker {
    constructor(playerID) {
        this.statMap = {
            "Kills": 0,
            "Damage": 0,
        }
    }

    getStat(name) {
        return this.statMap[name];
    }

    grantStat(name, value = 1) {
        this.statMap[name] += value;
    }

    grantKill() {
        this.grantStat("Kills");
    }

    grantDamage(value) {
        this.grantStat("Damage", value);
    }
}

module.exports = StatTracker;