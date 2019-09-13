import Vector2D from "../../../shared/code/Math/CVector2D.js"
import {typeCheck} from "../../../shared/code/Debugging/CtypeCheck.js"
import CObjectNotationMap from "../../../shared/code/DataStructures/CObjectNotationMap.js";

class Camera {
    constructor(offsetX, offsetY) {
        this.displayPos = new Vector2D(0, 0);
        this.pos = {
            x: -(this.displayPos.x - offsetX),
            y: -(this.displayPos.y - offsetY)
        };

        this.offset = {
            x: offsetX,
            y: offsetY,
        };

        this.originalOffset = {
            x: offsetX,
            y: offsetY,
        };
        this.shifting = {
            x: 0,
            y: 0,
        };
        this.follow = new Vector2D(0, 0);
        this.camConfigs = new CObjectNotationMap();
        this.camConfigs.set("followPlayer", true);
        this.camConfigs.set("followEM", false);
        this.isShifted = false;
    }

    config(string) {
        return this.camConfigs.get(string);
    }

    setCurrentFollowPos(pos) {
        this.follow = pos;
    }

    update() {
        if (this.isShifted) {
            this.offset.x = this.shifting.x;
            this.offset.y = this.shifting.y;
        }
        this.displayPos.x = -Math.round(this.follow.x - this.offset.x);
        this.displayPos.y = -Math.round(this.follow.y - this.offset.y);
        this.offset.x = this.originalOffset.x;
        this.offset.y = this.originalOffset.y;
        this.isShifted = false;
    }

    shift(x, y) {
        this.shifting.x = this.originalOffset.x + x;
        this.shifting.y = this.originalOffset.y + y;
        this.isShifted = true;
    }

    get x() {
        return this.displayPos.x;
    }

    get y() {
        return this.displayPos.y;
    }

    set displayPos(vec2D) {
        typeCheck.instance(Vector2D, vec2D);
        this._displayPos = vec2D;
    }

    get displayPos() {
        return this._displayPos;
    }
}

export default Camera;