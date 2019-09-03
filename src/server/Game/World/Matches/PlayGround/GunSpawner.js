const Entity = require("../../../Entity/SEntity.js");
const Tile = require("../../../TileBased/Tile.js");

const WeaponItem = require("../../../Entity/Loot/Weapons/Base/WeaponItem.js");
const KE_6H = require("../../../Entity/Loot/Weapons/KE_6H.js");
const BIGMotorizer = require("../../../Entity/Loot/Weapons/BIGMotorizer.js");
const SEW_9 = require("../../../Entity/Loot/Weapons/SEW-9.js");

const START_TILE = 14 * 8; // 14 rows times 8 cols on tile-sheet

const GUN_LIST = {
    1: (x, y) => new KE_6H(x, y),
    2: (x, y) => new BIGMotorizer(x, y),
    3: (x, y) => new SEW_9(x, y),
};

class GunSpawner extends Entity {
    constructor(x, y, args) {
        super(x, y, Tile.SIZE, Tile.SIZE);
        this.setQuadTreeRange(this.width, this.height);

        this.gunID = args.id - START_TILE;
        this.currentTickTime = 0;
        this.maxTickTime = 2;
        this.shouldSpawn = true;
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof WeaponItem) {
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
                game.spawnEntity(this.pos.x, this.pos.y, GUN_LIST[this.gunID](this.pos.x, this.pos.y));
                this.shouldSpawn = false;
            }
        }
    }


}

GunSpawner.START_TILE = START_TILE;

module.exports = GunSpawner;