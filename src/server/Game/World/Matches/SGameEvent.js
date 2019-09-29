const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

class SGameEvent {
    constructor(id, type, arg , color, life, priority) {
        this.id = id;
        this.type = type.toLowerCase();
        this.color = color;
        this.life = life;
        this.priority = priority;
        this.arg = arg;
    }

    getEvent(){
        return this;
    }
}

module.exports = SGameEvent;