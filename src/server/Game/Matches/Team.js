class Team {
    constructor(name) {
        this._name = name;
        this._players = {};
        this._playerCount = 0;
    }

    get players() {
        return this._players;
    }

    get name() {
        return this._name;
    }

    set name(val) {
        this._name = val;
    }

    removePlayer(player) {
        player.team = null;
        //player._teamName = "none"; // Well this dont work...
        this._playerCount--;
        delete this._players[player.id];
    }

    isFull() {
        return this._playerCount === Team.MAX_PLAYERS;
    }

    addPlayer(player) {
        if (this.isFull()) {
            console.log("Team " + this._name + " has reached maximum amount of players");
            return;
        }
        this._playerCount++;
        this._players[player.id] = player;
        player.setTeam(this);
    }
}

Team.Names = {
    0: "red",
    1: "blue",
    2: "green",
    3: "yellow",
};

Team.MAX_PLAYERS = 3;

module.exports = Team;