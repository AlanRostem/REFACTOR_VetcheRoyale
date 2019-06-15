import Vector2D from "../../../shared/Math/CVector2D.js"
import {typeCheck} from "../../../shared/Debugging/CtypeCheck.js"
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
        }
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

    shift() {
        // TODO: Update position based on the client's player position
    }
}