const Alive = require("../Traits/Alive.js");
const ClientPEM = require("./ClientPEM.js");
const Inventory = require("./Inventory.js");

class Player extends Alive {
    constructor(x, y, client) {
        super(x, y, 6, 12, 100, true);

        // MISC VAR INITS

        this._id = client.id;
        this._teamName = "red";
        this._snapShotGenerator._snapShot._id = this._id;
        this._clientRef = client;
        this._entitiesInProximity = new ClientPEM(this);
        this._inventory = new Inventory();
        this._jumping = false;
        this._center = {
            _x: x + this._width / 2,
            _y: y + this._height / 2,
        };

        // TEST:
        this._playersOnTopOfMe = {};
        this._movementState.main = "stand";
        this._movementState.direction = "right";

        // INIT FUNCTIONS:
        this.addDynamicSnapShotData([
            "_teamName",
            "_center",
            "_hp",
        ]);

        // Unnecessary at the moment:
        this.addCollisionListener("Player", (player, entityManager) => {
            if (this.isTeammate(player)) {
                this.onTeamCollision(player);
            }
        });


        // PHYSICS

        this._speed = {
            ground: 65 * 55,
            jump: -190,
        };

        this._gravity = 500;
        this.acc.y = this._gravity;
    }

    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this._entitiesInProximity.initProximityEntityData(entityManager);
        this._clientRef.emit("initEntity", this._entitiesInProximity.exportDataPack())
    }

    get inventory() {
        return this._inventory;
    }

    get entitiesInProximity() {
        return this._entitiesInProximity;
    }

    get client() {
        return this._clientRef;
    }

    get keys() {
        return this._clientRef.inputReceiver.keys;
    }

    get input() {
        return this._clientRef.inputReceiver;
    }

    setTeam(team) {
        this.team = team;
        this._teamName = team.name;
    }

    onTeamCollision(p) {

    }

    isCollidingWithTeammate() {
        for (var id in this._playersOnTopOfMe) {
            if (this._playersOnTopOfMe[id]) {
                return true;
            }
        }
    }

    oneWayTeamCollision(deltaTime) {
        if (this.team)
            for (var id in this.team.players) {
                if (id !== this.id) {
                    var p = this.team.players[id];
                    var bottomLine = {
                        pos: {x: this.pos.x, y: this.pos.y + this.height + this.vel.y * deltaTime},
                        width: this._width,
                        height: 1
                    };

                    if (p.overlapEntity(bottomLine) && !p._jumping) {
                        if (this.pos.y + this.height < p.pos.y && this.vel.y > 0) {
                            this.onGround(p);
                            this._playersOnTopOfMe[p.id] = true;
                        }
                    } else {
                        this._playersOnTopOfMe[p.id] = false;
                    }

                    if (this._playersOnTopOfMe[p.id]) {
                        if (this.overlapEntity(p)) {
                            if (this.pos.y + this.height > p.pos.y) {
                                this.onGround(p);
                            }
                        }
                    }
                }
            }
    }

    isTeammate(player) {
        if (player instanceof Player) {
            return player.team.name === this.team.name;
        }
        return false;
    }

    onGround(p) {
        this.pos.y = p.pos.y - this.height;
        this.vel.y = 0;
        this._jumping = false;
        this.side.bottom = true;
        this._movementState.main = "stand";
    }

    remove() {
        this.team.removePlayer(this);
    }

    update(entityManager, deltaTime) {
        if (this.side.bottom) {
            this._movementState.main = "stand";
        } else {
            this._jumping = true;
        }

        if (this.isCollidingWithTeammate()) {
            this.side.bottom = true;
            this._jumping = false;
            this._movementState.main = "stand";
        }

        if (this.input.keyHeldDown(32)) {
            if (!this._jumping) {
                this.vel.y = this._speed.jump;
                this._jumping = true;
            }
        }

        this.vel.x = 0;

        if (this.input.keyHeldDown(68)) {
            this.accelerateX(this._speed.ground, deltaTime);
            this._movementState.direction = "right";
        }

        if (this.input.keyHeldDown(65)) {
            this.accelerateX(-this._speed.ground, deltaTime);
            this._movementState.direction = "left";
        }

        super.update(entityManager, deltaTime);
        this.oneWayTeamCollision(deltaTime);

        if (this.vel.x !== 0) {
            this._movementState.main = "run";
        }

        if (this.vel.y < 0) {
            this._movementState.main = "jump";
        } else if (this.vel.y > 0) {
            this._movementState.main = "fall";
        }

        if (this.side.bottom) {
            this._jumping = false;
        }

        this._center._x = this.center.x;
        this._center._y = this.center.y;
    }
}

module.exports = Player;