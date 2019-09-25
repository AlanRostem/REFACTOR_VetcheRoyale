const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

class SGameEvent {
    constructor(name, type, arg , color, life) {
        this.name = name;
        this.type = type.toLowerCase();
        this.color = color;
        this.life = life;
        this.arg = arg;
    }

    getEvent(){
        return this;
    }
}

module.exports = SGameEvent;