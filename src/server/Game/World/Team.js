class Team {
    constructor(name) {
        this._name = name;
        this._players = {};
        this._arrayPlayers = [];
        this._playerCount = 0;
    }

    get players() {
        return this._players;
    }

    get array() {
        return this._arrayPlayers;
    }

    createIDArray() {
        return Object.keys(this._players);
    }

    get name() {
        return this._name;
    }

    set name(val) {
        this._name = val;
    }

    hasEntity(id) {
        return this._players.hasOwnProperty(id);
    }

    removePlayer(player) {
        player.team = null;
        //player._teamName = "none"; // Well this dont work...
        this._playerCount--;
        this._arrayPlayers.remove(player.id);
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
        this._arrayPlayers.push(player.id);
        player.setTeam(this);
    }
}

Team.Names = {
    0: "red",
    1: "blue",
    2: "green",
    3: "yellow",
};

Team.MAX_PLAYERS = 2;

module.exports = Team;