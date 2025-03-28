class Team {
    // TODO: Fix all naming about player to just alive entity
    constructor() {
        this.name = "name";
        this.id = String.random();
        this.players = {};
        this.arrayPlayers = [];
        this.playerCount = 0;
        this.data = {};
        this.dataQueue = {};
    }

    get array() {
        return this.arrayPlayers;
    }

    createIDArray() {
        return Object.keys(this.players);
    }

    update() {
        this.data = this.dataQueue;
        this.dataQueue = {};

    }

    sendData(key, value) {
        this.dataQueue[key] = value;
    }

    hasEntity(id) {
        return this.players.hasOwnProperty(id);
    }

    removePlayer(player) {
        player.team = null;
        //player.teamName = "none"; // Well this dont work...
        this.playerCount--;
        this.arrayPlayers.remove(player.id);
        delete this.players[player.id];
    }

    isFull(game) {
        return this.playerCount === game.getGameRule("maxTeamMembers");
    }

    addPlayer(player, game) {
        if (this.isFull(game)) {
            console.log("Team " + this.name + " has reached maximum amount of players");
            return;
        }
        this.playerCount++;
        this.players[player.id] = player;
        this.arrayPlayers.push(player.id);
        player.setTeam(this);
    }
}

Team.Names = {
    0: "green",
    1: "blue",
    2: "red",
    3: "yellow",
};

module.exports = Team;