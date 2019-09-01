const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

class GameEvent {
    constructor(name, type, pos = undefined) {
        this._name = name;
        this._type = type;
        this._pos = pos;
    }

    getEvent(){
        return {
            _name:this._name,
            _type:this._type,
            _pos:this._pos
        };
    }
}

module.exports = GameEvent;