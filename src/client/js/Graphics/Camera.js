import Vector2D from "../../../shared/Math/Vector2D.js"
import dataCheck from "../../../shared/Debugging/dataCheck.js"
export default class Camera {
    constructor(boundVec2D = new Vector2D(0, 0), offsetX, offsetY) {
        this.boundPos = boundVec2D;
        this.pos = {
            x: -(this.boundPos.x - offsetX),
            y: -(this.boundPos.y - offsetY)
        };
        this.offset = {
            x: offsetX,
            y: offsetY,
        }
    }

    set boundPosition(vec2D) {
        dataCheck.object(Vector2D, vec2D);
        this.boundPos = vec2D;
    }

    update() {
        // TODO: Update position based on the client's player position
    }

}