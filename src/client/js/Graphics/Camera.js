import Vector2D from "../../../shared/code/Math/CVector2D.js"
import {typeCheck} from "../../../shared/code/Debugging/CtypeCheck.js"
import CObjectNotationMap from "../../../shared/code/DataStructures/CObjectNotationMap.js";

/**
 * Camera object that holds the positional data of where to offset
 * the view.
 */
class Camera {
    /**
     * @param offsetX {number} - Offset relative to the viewport position on the x-axis
     * @param offsetY {number} - Offset relative to the viewport position on the y-axis
     */
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

    /**
     * Map a camera boolean configuration to your custom liking
     * @param name {string} - Mapping name
     * @param boolean {boolean} - True of false
     */
    setConfig(name, boolean) {
        this.camConfigs.set(name, boolean);
    }

    /**
     * Retrieve a mapped configuration of the camera (e.g. follow player or other objects)
     * @param string {string} - Mapping name
     * @returns {boolean}
     */
    config(string) {
        return this.camConfigs.get(string);
    }

    /**
     * Set the current following positions (reference to the vector)
     * @param pos {Vector2D} - Reference to the 2D vector
     */
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

    /**
     * Shift the camera temporarily by some arbitrary value
     * @param x {number} - Offset on the x-axis
     * @param y {number} - Offset on the y-axis
     */
    shift(x, y) {
        this.shifting.x = this.originalOffset.x + x;
        this.shifting.y = this.originalOffset.y + y;
        this.isShifted = true;
    }

    /**
     * Get the bound x-axis position
     * @returns {number}
     */
    get x() {
        return this.displayPos.x;
    }

    /**
     * Get the bound y-axis position
     * @returns {number}
     */
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