Team = require("./Team.js");

class TeamManager {
    constructor() {
        this._teams = {};
        this._teamCount = -1;
        this.createTeam(new Team());
    }

    getTeam(name) {
        return this._teams[name];
    }

    addPlayer(player) {
        if (!this.getTeam(Team.Names[this._teamCount]).isFull()) {
            this.getTeam(Team.Names[this._teamCount]).addPlayer(player);
        } else {
            this.createTeam(new Team()).addPlayer(player);
        }
    }

    createTeam(team) {
        if (this._teamCount < TeamManager.MAX_TEAMS) {
            this._teams[
                Team.Names[++this._teamCount]] = team;
            team.name = Team.Names[this._teamCount];
        }
        return team;
    }
}

TeamManager.MAX_TEAMS = 4; // TODO: Increase to the wanted count

module.exports = TeamManager;