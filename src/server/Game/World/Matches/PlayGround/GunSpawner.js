
const Entity = require("../../../Entity/SEntity.js");
const Tile = require("../../../TileBased/Tile.js");

const WeaponItem = require("../../../Entity/Loot/Weapons/Base/WeaponItem.js");
const KE_6H = require("../../../Entity/Loot/Weapons/KE_6H.js");
const BIGMotorizer = require("../../../Entity/Loot/Weapons/BIGMotorizer.js");
const SEW_9 = require("../../../Entity/Loot/Weapons/SEW-9.js");
const Interlux = require("../../../Entity/Loot/Weapons/Interlux.js");
const AquaSLG = require("../../../Entity/Loot/Weapons/AquaSLG.js");
const CKER90 = require("../../../Entity/Loot/Weapons/CKER90.js");

const START_TILE = 14 * 8; // 14 rows times 8 cols on tile-sheet

class GunSpawnFunction {
    constructor(_class) {
        this._class = _class;
        this._func = (x, y) => new this._class(x, y);
    }

    getType() {
        return this._class;
    }

    apply(x, y) {
        return this._func(x, y);
    }
}

const GUN_LIST = {
    1: new GunSpawnFunction(CKER90),
    2: new GunSpawnFunction(SEW_9),
    3: new GunSpawnFunction(KE_6H),
    4: new GunSpawnFunction(Interlux),
    5: new GunSpawnFunction(BIGMotorizer),
    6: new GunSpawnFunction(AquaSLG)
};


class GunSpawner extends Entity {
    constructor(x, y, args) {
        super(x, y, Tile.SIZE, Tile.SIZE);
        this.setCollisionRange(this.width, this.height);

        this.gunID = args.id - START_TILE;
        this.currentTickTime = 0;
        this.maxTickTime = 2;
        this.shouldSpawn = true;
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof GUN_LIST[this.gunID].getType()) {
            this.shouldSpawn = false;
            this.currentTickTime = this.maxTickTime;
            entity.resetLifeTime(entityManager);
        }
    }

    update(game, deltaTime) {
        this.shouldSpawn = true;
        super.update(game, deltaTime);
        if (this.currentTickTime > 0) {
            this.currentTickTime -= deltaTime;
        }

        if (this.shouldSpawn) {
            if (this.currentTickTime <= 0) {
                game.spawnEntity(this.pos.x, this.pos.y, GUN_LIST[this.gunID].apply(this.pos.x, this.pos.y));
                this.shouldSpawn = false;
            }
        }
    }


}

GunSpawner.START_TILE = START_TILE;

module.exports = GunSpawner;