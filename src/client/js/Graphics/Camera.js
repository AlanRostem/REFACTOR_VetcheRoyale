import Vector2D from "../../../shared/Math/Vector2D.js"
import typeCheck from "../../../shared/Debugging/typeCheck.js"
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

    set boundPosition(vec2D) {
        typeCheck.instance(Vector2D, vec2D);
        this._boundPos = vec2D;
    }

    get boundPosition() {
        return this._boundPos;
    }

    get offset() {
        return this._offset;
    }

    shift() {
        // TODO: Update position based on the client's player position
    }
}