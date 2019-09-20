const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

class GameEvent {
    constructor(name, type, arg , life = 30) {
        this.name = name;
        this.type = type;
        this.life = life;
        this.arg = arg;
    }

    getEvent(){
        return this;
    }
}

module.exports = GameEvent;