const GameDataLinker = require("./GameDataLinker.js");
const ClientPEM = require("./ClientPEM.js");
const Inventory = require("./Inventory.js");
const StatTracker = require("./StatTracker.js");
const Team = require("../../World/Team.js");
const TileCollider = require("../../TileBased/STileCollider.js");
const Tile = require("../../TileBased/Tile.js");

const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const Loot = require("../Loot/Loot.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const HitScanner = require("../../Mechanics/Scanners/HitScanner.js");

// The main player class that has a link to the client.
class Player extends GameDataLinker {
    constructor(x, y, client) {
        super(client, x, y, 6, 12, 100, true);

        // MISC VAR INITS

        this._id = client.id;
        this._teamName = "red";
        //new Team(Team.Names[Math.random() * 4 | 0]).addPlayer(this);
        this._snapShotGenerator._snapShot._id = this._id;
        this._clientRef = client;
        this._entitiesInProximity = new ClientPEM(this);
        this._inventory = new Inventory();
        this._invWeaponID = null;
        this._invAmmo = null;
        this._stats = new StatTracker(this.id);
        this._statData = this._stats._statMap;

        this._jumping = false;
        this._center = {
            _x: x + this._width / 2,
            _y: y + this._height / 2,
        };

        this.addMovementListener("main", "stand", () => 0);
        this.addMovementListener("direction", "right", () => 0);
        this.addMovementListener("tile", "slope", () => 0);

        // INIT FUNCTIONS:
        this.addDynamicSnapShotData([
            "_teamName",
            "_center",
            "_hp",
            "_invAmmo",
            "_invWeaponID",
        ]);

        this.addStaticSnapShotData([
            "_statData"
        ]);


        // PHYSICS DATA

        this._speed = {
            ground: 60,
            jump: -190,
            gravity: 500
        };

        this.setCollisionResponseID("Player");

        this.acc.y = this._speed.gravity;
        this.acc.x = this._speed.ground;

        this._itemsNearby = new ONMap();
        this._itemScanner = new HitScanner([], false);
    }

    // Using this function to scan for items the player
    // is able to pick up.
    forEachNearbyEntity(entity, entityManager) {
        super.forEachNearbyEntity(entity, entityManager);
        if (this.input.keyHeldDown(69)) {
            if (entity instanceof Loot) {
                let distance = Vector2D.distance(this.center, entity.center);
                this._itemScanner.scan(this.id, this.center, entity.center, entityManager, entityManager.tileMap);
                if (HitScanner.intersectsEntity(this.center, this._itemScanner._end, entity)
                    && entity.canPickUp(this) && distance < Loot.PICK_UP_RANGE) {
                    this._itemsNearby.set(entity.id, distance);
                }
            }
        }
    }

    // Calculates the closest item capable of being picked
    // up and then picks it up.
    checkForNearbyLoot(game) {
        if (this.input.singleKeyPress(69)) {
            let closest = Math.min(...this._itemsNearby.array);
            for (let id in this._itemsNearby.object) {
                let loot = game.getEntity(id);
                if (loot) {
                    if (this._itemsNearby.get(loot.id) === closest) {
                        loot.onPlayerInteraction(this, game);
                    }
                }
            }
            this._itemsNearby.clear();
        }
    }

    get stats() {
        return this._stats;
    }

    get speed() {
        return this._speed;
    }

    // Sends the initial data pack to the client.
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

    get input() {
        return this._clientRef.inputReceiver;
    }


    setTeam(team) {
        this.team = team;
        this._teamName = team.name;
    }

    // Performs one way team tileCollision.
    oneWayTeamCollision(deltaTime) {
        if (this.team) {
            for (var id in this.team.players) {
                if (id !== this.id) {
                    var p = this.team.players[id];
                    if (this.overlapEntity(p) && !p._jumping) {
                        if (this.pos.y + this.height > p.pos.y && this._old.y + this.height <= p.pos.y) {
                            this.pos.y = p.pos.y - this.height;
                            this.vel.y = 0;
                            this._jumping = false;
                            this.side.bottom = true;
                            this.setMovementState("main", "stand");
                        }
                    }
                }
            }
        }
    }

    isTeammate(player) {
        if (player instanceof Player) {
            if (player.team && this.team) {
                return player.team.name === this.team.name;
            }
        }
        return false;
    }

    remove() {
        super.remove();
        if (this.team) {
            this.team.removePlayer(this);
        }
    }

    customCollisionY(game, tileMap, deltaTime) {
        this.oneWayTeamCollision(deltaTime);
    }

    update(entityManager, deltaTime) {

        this.setMovementState("tile", "none");

        this._invAmmo = this.inventory.ammo;
        if (this.inventory.weapon) {
            this._invWeaponID = this.inventory.weapon.id;
        } else {
            this._invWeaponID = null;
        }

        if (this.side.bottom) {
            this.setMovementState("main", "stand");
        } else {
            this._jumping = true;
        }

        if (this.input.keyHeldDown(32)) {
            if (!this._jumping) {
                this.vel.y = this._speed.jump;
                this._jumping = true;
            }
        }

        this.setMovementState("slope", "false");
        super.update(entityManager, deltaTime);
        this.checkForNearbyLoot(entityManager);

        this.vel.x *= this.fric.x;

        if (this.input.keyHeldDown(68)) {
            //this.accelerateX(this.acc.x, deltaTime);
            this.vel.x = this.speed.ground;
            this.setMovementState("direction", "right");

        }

        if (this.input.keyHeldDown(65)) {
            //this.accelerateX(-this.acc.x, deltaTime);
            this.vel.x = -this.speed.ground;
            this.setMovementState("direction", "left");
        }

        if (this.vel.x !== 0) {
            this.setMovementState("main", "run");
        }

        if (!this.checkMovementState("slope", "true")) {
            if (this.vel.y < 0) {
                this.setMovementState("main", "jump");
            } else if (this.vel.y > 0) {
                this.setMovementState("main", "fall");
            }
        }


        if (this.side.bottom) {
            this._jumping = false;
        }

        this._center._x = this.center.x;
        this._center._y = this.center.y;
    }
}

TileCollider.createCollisionResponse("Player", "ONE_WAY", "Y", (entity, tile, deltaTime) => {
    let collision = entity.pos.y + entity.height > tile.y && entity._old.y + entity.height <= tile.y;
    if (entity.overlapTile(tile)) {
        if (!entity.input.keyHeldDown(83)) {
            if (collision) {
                entity.vel.y = 0;
                entity.jumping = false;
                entity.pos.y = tile.y - entity.height;
                entity.side.bottom = true;
            }
        }
    }
});

TileCollider.createCollisionResponse("Player", "SLOPE_UP_LEFT", "Y", (entity, tile, deltaTime) => {
    if (entity.overlapTile(tile)) {
        let eLeftToSlopeRightDiff = tile.x + Tile.SIZE - entity.pos.x;

        let steppingPosY = -1 * eLeftToSlopeRightDiff + tile.y + Tile.SIZE;
        entity.setMovementState("slope", "true");

        if (eLeftToSlopeRightDiff > Tile.SIZE) {
            entity.jumping = false;
            entity.vel.y = 0;
            entity.pos.y = tile.y - entity.height;
            entity.side.bottom = true;
            if (entity.vel.x > 0) {
                entity.vel.y = entity.vel.x;
            }
        } else if (entity.pos.y + entity.height > steppingPosY) {
            entity.jumping = false;
            entity.vel.y = 0;
            entity.pos.y = steppingPosY - entity.height;
            entity.side.bottom = true;
            if (entity.vel.x > 0) {
                entity.vel.y = entity.vel.x;
            }
        }
    }
});

TileCollider.createCollisionResponse("Player", "SLOPE_UP_RIGHT", "Y", (entity, tile, deltaTime) => {
        if (entity.constructor.name !== "Player") {
            //   return;
        }
        if (entity.overlapTile(tile)) {
            let eRightToSlopeLeftDiff = entity.pos.x + entity.width - tile.x;

            let steppingPosY = -1 * eRightToSlopeLeftDiff + tile.y + Tile.SIZE;
            entity.setMovementState("slope", "true");

            if (eRightToSlopeLeftDiff > Tile.SIZE) {
                entity.jumping = false;
                entity.vel.y = 0;
                entity.pos.y = tile.y - entity.height;
                entity.side.bottom = true;
                if (entity.vel.x < 0) {
                    entity.vel.y = -entity.vel.x;
                }
            } else if (entity.pos.y + entity.height > steppingPosY) {
                entity.jumping = false;
                entity.vel.y = 0;
                entity.pos.y = steppingPosY - entity.height;
                entity.side.bottom = true;
                if (entity.vel.x < 0) {
                    entity.vel.y = -entity.vel.x;
                }
            }
        }
    },
);

module.exports = Player;