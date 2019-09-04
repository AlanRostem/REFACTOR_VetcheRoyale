Team = require("./Team.js");

class TeamManager {
    constructor(game) {
        this.teams = {};
        this.teamCount = 0;
        this.createTeam(new Team(game), game);
        this.MAX_TEAM_COLORS = 4;
    }

    getTeam(teamCount) {
        return this.teams[teamCount];
    }

    addPlayer(player, game) {
        if (this.teamCount === 0) {
            this.createTeam(new Team(game), game).addPlayer(player, game);
        }
        if (!this.getTeam(this.teamCount).isFull(game)) {
            this.getTeam(this.teamCount).addPlayer(player, game);
        } else {
            this.createTeam(new Team(game), game).addPlayer(player, game);
        }
    }

    createTeam(team, game) {
        this.teams[++this.teamCount] = team;
        team.name = Team.Names[(this.teamCount) % 4];
        return team;
    }
}


module.exports = TeamManager;