const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

class GameEvent {
    constructor(name, type, arg) {
        this._name = name;
        this._type = type;
        this._arg = arg;
    }

    getEvent(){
        return {
            _name:this._name,
            _type:this._type,
            _arg:this._arg
        };
    }
}

module.exports = GameEvent;