const Affectable = require("./Affectable.js");

// Entity with HP and regenerative abilities.
class Alive extends Affectable {
    constructor(x, y, w, h, HP = 100, regen = false, regenPerTick = 1, regenSpeed = 0.2, regenCoolDown = 10) {
        super(x, y, w, h);

        this.maxHP = HP;
        this.hp = HP;
        this.isAlive = true;
        this.killed = false;
        this.killer = null; // Player who killed this entity
        this.addDynamicSnapShotData([
           "isAlive"
        ]);
        this.shouldRegen = regen;
        if (regen) {
            this.regenPerTick = regenPerTick;
            this.currentRegenSpeed = 0;
            this.maxRegenSpeed = regenSpeed;
            this.currentRegenCooldown = 0;
            this.maxRegenCooldown = regenCoolDown;
            this.takingDamage = false;
        }
    }

    set HP(val) {
        var edit = Math.max(val, 0);
        this.hp = Math.min(edit, this.maxHP);
        if (this.hp === 0) this.isAlive = false;
    }

    get dead() {
        return !this.isAlive;
    }

    get HP() {
        return this.hp;
    }

    // When inflicted enough damage upon to become dead.
    dieBy(player) {
        this.killer = player;
    }

    // Returns the killer of this entity
    get myKiller() {
        return this.killer;
    }

    takeDamage(value) {
        this.HP -= value;
        this.takingDamage = true;
        this.currentRegenCooldown = this.maxRegenCooldown;
    }

    updateRegen(deltaTime) {
        if (this.hp < this.maxHP) {
            if (!this.takingDamage) {
                this.currentRegenSpeed -= deltaTime;
                if (this.currentRegenSpeed <= 0) {
                    this.currentRegenSpeed = this.maxRegenSpeed;
                    this.HP += this.regenPerTick;
                }
            } else {
                this.currentRegenCooldown -= deltaTime;
                if (this.currentRegenCooldown <= 0) {
                    this.currentRegenCooldown = 0;
                    this.takingDamage = false;
                }
            }
        }
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.shouldRegen) {
            this.updateRegen(deltaTime);
        }
        if (!this.isAlive) {
            if (!this.killed) {
                this.onDead(entityManager, deltaTime);
                this.killed = true;
            }
        }
    }

    onDead(entityManager, deltaTime) {
        // Event handling here
    }
}

module.exports = Alive;