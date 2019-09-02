Team = require("./Team.js");

class TeamManager {
    constructor(game) {
        this._teams = {};
        this._teamCount = 0;
        this.createTeam(new Team(game), game);
        this.MAX_TEAM_COLORS = 4;
    }

    getTeam(teamCount) {
        return this._teams[teamCount];
    }

    addPlayer(player, game) {
        if (this._teamCount === 0) {
            this.createTeam(new Team(game), game).addPlayer(player, game);
        }
        if (!this.getTeam(this._teamCount).isFull()) {
            this.getTeam(this._teamCount).addPlayer(player, game);
        } else {
            this.createTeam(new Team(game), game).addPlayer(player, game);
        }
    }

    createTeam(team, game) {
        this._teams[++this._teamCount] = team;
        team.name = Team.Names[(this._teamCount) % 4];
        return team;
    }
}


module.exports = TeamManager;