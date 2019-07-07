const Entity = require("../SEntity.js");

class Alive extends Entity {
    constructor(x, y, w, h, HP = 100, regen = false, regenPerTick = 1, regenSpeed = 0.167, regenCoolDown = 5) {
        super(x, y, w, h);

        this._maxHP = HP;
        this._hp = HP;
        this._isAlive = true;
        this._killed = false;
        this._shouldRegen = regen;
        if (regen) {
            this._regenPerTick = regenPerTick;
            this._currentRegenSpeed = 0;
            this._maxRegenSpeed = regenSpeed;
            this._currentRegenCooldown = 0;
            this._maxRegenCooldown = regenCoolDown;
            this._takingDamage = false;
        }
    }

    set HP(val) {
        var edit = Math.max(val, 0);
        this._hp = Math.min(edit, this._maxHP);
        if (this._hp === 0) this._isAlive = false;
    }

    get HP() {
        return this._hp;
    }

    takeDamage(value) {
        this.HP -= value;
        this._takingDamage = true;
        this._currentRegenCooldown = this._maxRegenCooldown;
    }

    updateRegen(deltaTime) {
        if (this._hp < this._maxHP) {
            if (!this._takingDamage) {
                this._currentRegenSpeed -= deltaTime;
                if (this._currentRegenSpeed <= 0) {
                    this._currentRegenSpeed = this._maxRegenSpeed;
                }
            } else {
                this._maxRegenCooldown -= deltaTime;
                if (this._maxRegenCooldown <= 0) {
                    this._maxRegenCooldown = 0;
                    this._takingDamage = false;
                }
            }
        }
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this._shouldRegen) {
            this.updateRegen(deltaTime);
        }
        if (!this._isAlive) {
            if (!this._killed) {
                this.onDead(entityManager, deltaTime);
                this._killed = true;
            }
        }
    }

    onDead(entityManager, deltaTime) {
        // Event handling here
    }
}

module.exports = Alive;