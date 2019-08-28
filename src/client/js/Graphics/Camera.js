import Vector2D from "../../../shared/code/Math/CVector2D.js"
import {typeCheck} from "../../../shared/code/Debugging/CtypeCheck.js"
export default class Camera {
    constructor(offsetX, offsetY, boundVec2D = new Vector2D(0, 0)) {
        this._boundPos = boundVec2D;
        this._pos = {
            x: -(this._boundPos.x - offsetX),
            y: -(this._boundPos.y - offsetY)
        };

        this._offset = {
            x: offsetX,
            y: offsetY,
        };

        this._originalOffset = {
            x: offsetX,
            y: offsetY,
        };

    }

    update(pos) {
        this._boundPos.x = -Math.round(pos._x - this._offset.x);
        this._boundPos.y = -Math.round(pos._y - this._offset.y);
        this._offset.x = this._originalOffset.x;
        this._offset.y = this._originalOffset.y;
    }

    shift(x, y) {
        this._offset.x = this._originalOffset.x + x;
        this._offset.y = this._originalOffset.y + y;
    }

    get x() {
        return this.boundPos.x;
    }

    get y() {
        return this.boundPos.y;
    }

    set boundPos(vec2D) {
        typeCheck.instance(Vector2D, vec2D);
        this._boundPos = vec2D;
    }

    get boundPos() {
        return this._boundPos;
    }

    get offset() {
        return this._offset;
    }
}