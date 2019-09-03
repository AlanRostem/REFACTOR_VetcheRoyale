const Affectable = require("./Affectable.js");

// Entity with HP and regenerative abilities.
class Alive extends Affectable {
    constructor(x, y, w, h, HP = 100, regen = false, regenPerTick = 1, regenSpeed = 0.2, regenCoolDown = 10) {
        super(x, y, w, h);

        this._maxHP = HP;
        this._hp = HP;
        this._isAlive = true;
        this._killed = false;
        this._killer = null; // Player who killed this entity
        this.addDynamicSnapShotData([
           "_isAlive"
        ]);
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

    get dead() {
        return !this._isAlive;
    }

    get HP() {
        return this._hp;
    }

    // When inflicted enough damage upon to become dead.
    dieBy(player) {
        this._killer = player;
    }

    // Returns the killer of this entity
    get myKiller() {
        return this._killer;
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
                    this.HP += this._regenPerTick;
                }
            } else {
                this._currentRegenCooldown -= deltaTime;
                if (this._currentRegenCooldown <= 0) {
                    this._currentRegenCooldown = 0;
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