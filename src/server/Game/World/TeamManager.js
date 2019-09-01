Team = require("./Team.js");

class TeamManager {
    constructor(maxTeams = 4) {
        this._teams = {};
        this._teamCount = 0;
        this.createTeam(new Team());
        this.MAX_TEAMS = maxTeams;
    }

    getTeam(teamCount) {
        return this._teams[teamCount];
    }

    addPlayer(player) {
        if (!this.getTeam(this._teamCount)) {
            this.createTeam(new Team()).addPlayer(player);
            return;
        }
        if (!this.getTeam(this._teamCount).isFull()) {
            this.getTeam(this._teamCount).addPlayer(player);
        } else {
            this.createTeam(new Team()).addPlayer(player);
        }
    }

    createTeam(team) {
        this._teams[++this._teamCount] = team;
        team.name = Team.Names[(this._teamCount) % 4];
        return team;
    }
}


module.exports = TeamManager;