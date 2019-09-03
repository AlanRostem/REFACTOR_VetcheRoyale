import Vector2D from "../../../shared/code/Math/CVector2D.js"
import {typeCheck} from "../../../shared/code/Debugging/CtypeCheck.js"
export default class Camera {
    constructor(offsetX, offsetY, boundVec2D = new Vector2D(0, 0)) {
        this.boundPos = boundVec2D;
        this.pos = {
            x: -(this.boundPos.x - offsetX),
            y: -(this.boundPos.y - offsetY)
        };

        this.offset = {
            x: offsetX,
            y: offsetY,
        };

        this.originalOffset = {
            x: offsetX,
            y: offsetY,
        };

    }

    update(pos) {
        this.boundPos.x = -Math.round(pos.x - this.offset.x);
        this.boundPos.y = -Math.round(pos.y - this.offset.y);
        this.offset.x = this.originalOffset.x;
        this.offset.y = this.originalOffset.y;
    }

    shift(x, y) {
        this.offset.x = this.originalOffset.x + x;
        this.offset.y = this.originalOffset.y + y;
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
}