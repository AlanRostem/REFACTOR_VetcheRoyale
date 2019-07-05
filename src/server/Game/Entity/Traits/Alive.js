Entity = require("../SEntity.js");

class Alive extends Entity {
    constructor(x, y, w, h, HP = 100) {
        super(x, y, w, h);

        this._maxHP = HP;
        this._hp = HP;
        this._isAlive = true;
        this._killed = false;
    }

    set HP(val) {
        var edit = Math.max(val, 0);
        this._hp = Math.min(edit, this._maxHP);
        if (this._hp === 0) this._isAlive = false;
    }

    get HP() {
        return this._hp;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
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