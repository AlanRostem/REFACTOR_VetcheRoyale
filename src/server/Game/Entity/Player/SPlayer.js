const GameDataLinker = require("./GameDataLinker.js");
const Inventory = require("./Inventory.js");
const StatTracker = require("./StatTracker.js");
const TileCollider = require("../../TileBased/TileCollider.js");
const Tile = require("../../TileBased/Tile.js");
const PacketBuffer = require("../../../Networking/PacketBuffer.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const Loot = require("../Loot/Loot.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const HitScanner = require("../../Mechanics/Scanners/HitScanner.js");

// The main player class that has a link to the client.
class Player extends GameDataLinker {
    static _ = (() => {
        Player.addDynamicValues(
            "teamName",
            "centerData",
            "hp",
            "invAmmo",
            "invWeaponID",
            "statData",
            "side",
            "teamID"
        );
    })();

    constructor(clientID, worldMgr) {
        super(0, 0, 6, 12, 100, true, worldMgr, clientID);
        // MISC VAR INITS
        this.teamName = "red";
        this.teamID = null;
        this.snapShotGenerator.snapShot.id = this.id;
        this.inventory = new Inventory();
        this.invWeaponID = null;
        this.invAmmo = null;
        this.stats = new StatTracker(this.id);
        this.packetBuffer = new PacketBuffer();
        this.statData = this.stats.statMap;

        this.jumping = false;
        this.centerData = {
            x: this.width / 2,
            y: this.height / 2,
        };

        this.addMovementListener("main", "stand", () => 0);
        this.addMovementListener("direction", "right", () => 0);
        this.addMovementListener("tile", "slope", () => 0);
        this.addMovementListener("canMove", true);
        this.addMovementListener("onPlayer", "false");

        this.setEntityOrder(1);

        // PHYSICS DATA

        this.speed = {
            ground: 65, //* 55,
            jump: -190,
            gravity: 500
        };

        this.setCollisionResponseID("Player");

        this.acc.y = this.speed.gravity;
        this.acc.x = this.speed.ground;

        this.itemsNearby = new ONMap();
        this.itemScanner = new HitScanner({}, false);
    }

    // Calculates the closest item capable of being picked
    // up and then picks it up.
    checkForNearbyLoot(game) {
        if (this.input.singleKeyPress(69)) {
            for (let id in this.entitiesInProximity.container) {
                let entity = this.entitiesInProximity.getEntity(id); // TODO: Remove after its array
                if (entity instanceof Loot) {
                    let distance = Vector2D.distance(this.center, entity.center);
                    if (entity.overlapEntity(this)) {
                        this.itemsNearby.set(entity.id, distance);
                        break;
                    }
                    if (entity.canPickUp(this) && distance < Loot.PICK_UP_RANGE) {
                        this.itemScanner.scan(this.center, entity.center, game, game.tileMap);
                        if (HitScanner.intersectsEntity(this.center, this.itemScanner.end, entity)) {
                            this.itemsNearby.set(entity.id, distance);
                        }
                    }
                }
            }

            let closest = Math.min(...this.itemsNearby.array);
            for (let id in this.itemsNearby.object) {
                let loot = game.getEntity(id); // TODO: Remove after its array
                if (loot) {
                    if (this.itemsNearby.get(loot.id) === closest) {
                        loot.onPlayerInteraction(this, game);
                    }
                }
            }
            this.itemsNearby.clear();
        }
    }

    // Performs one way team tileCollision.
    forEachNearbyEntity(entity, entityManager) {
        if (this.team) {
            if (entity instanceof Player) {
                if (this.isTeammate(entity)) {
                    let p = entity;
                    if (this.overlapEntity(p) && !p.jumping) {
                        if (this.pos.y + this.height > p.pos.y) {
                            if (this.old.y + this.height <= p.pos.y) {
                                this.pos.y = p.pos.y - this.height;
                                this.jumping = false;
                                this.vel.y = 0;
                                this.setMovementState("main", "stand");
                                this.side.bottom = true;
                            }
                        }
                    }
                }
            }
        }
    }

    onDead(entityManager, deltaTime) {
        super.onDead(entityManager, deltaTime);
        // TODO: Drop ammo and heals
    }

    get spectators() {
        return this.entitiesInProximity.spectators;
    }

    goRight() {
        this.vel.x = this.speed.ground;
        this.setMovementState("direction", "right");
    }

    goLeft() {
        this.vel.x = -this.speed.ground;
        this.setMovementState("direction", "left");
    }

    sendDataToTeam(key, value) {
        if (this.team) {
            this.team.sendData(key, value);
        }
    }

    update(entityManager, deltaTime) {

        if (this.team) {
            this.teamID = this.team.id;
        } else {
            this.teamID = null;
        }
        this.setMovementState("tile", "none");

        this.invAmmo = this.inventory.ammo;
        if (this.inventory.weapon) {
            this.invWeaponID = this.inventory.weapon.id;
        } else {
            this.invWeaponID = null;
        }

        this.inventory.update(entityManager);

        if (this.side.bottom) {
            this.setMovementState("main", "stand");
        } else {
            this.jumping = true;
        }

        if (this.input.keyHeldDown(32) && this.checkMovementState("canMove", true)) {
            if (!this.jumping) {
                this.vel.y = this.speed.jump;
                this.jumping = true;
            }
        }

        this.setMovementState("slope", "false");
        super.update(entityManager, deltaTime);
        this.checkForNearbyLoot(entityManager);

        this.vel.x *= this.fric.x;

        if (this.checkMovementState("canMove", true)) {
            if (!(this.input.keyHeldDown(68) && this.input.keyHeldDown(65))) {
                if (this.input.keyHeldDown(68)) {
                    this.goRight();
                }

                if (this.input.keyHeldDown(65)) {
                    this.goLeft();
                }
            }
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
            this.jumping = false;
        }

        this.centerData.x = this.center.x;
        this.centerData.y = this.center.y;
        /*
        if (this.team)
            for (let p in this.team.players)
                if (this.team.players[p].id !== this.id)
                    entityManager.eventManager.addPrivate(
                        this.team.players[p].id, "teamMember: " + this.id, "minimap", "Blue", 0, {
                            pos: this.pos
                        }
                    );*/

        this.setOutboundPacketData("teamData", this.team.data);
        let packet = this.packetBuffer.exportSnapshot(Object.keys(this.outboundData.object), this.outboundData.object);
        this.worldMgrRef.dataBridge.transferClientEvent("serverUpdateTick", this.id, packet);
        this.setMovementState("onPlayer", "false");
        this.gameData = {};
    }
}

TileCollider.createCollisionResponse("Player", "ONE_WAY", "Y", (entity, tile, deltaTime) => {
    let collision = entity.pos.y + entity.height > tile.y && entity.old.y + entity.height <= tile.y;
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
