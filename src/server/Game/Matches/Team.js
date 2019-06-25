class Team {
    constructor(name, match) {
        this._name = name;
        this._players = {};
        this._playerCount = 0;
    }

    addPlayer(player) {
        if (this._playerCount < Team.MAX_PLAYERS) {
        }
        this._playerCount++;
        this._players[player.id] = player;
    }
}

Team.Names = {
    RED: "red",
    BLUE: "blue",
    GREEN: "green",
    YELLOW: "yellow",
};

Team.MAX_PLAYERS = 3;

module.exports = Team;