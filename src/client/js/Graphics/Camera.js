import Vector2D from "../../../shared/Math/Vector2D.js"
import typeCheck from "../../../shared/Debugging/typeCheck.js"
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
        }
    }

    set boundPosition(vec2D) {
        typeCheck.object(Vector2D, vec2D);
        this.boundPos = vec2D;
    }

    update() {
        // TODO: Update position based on the client's player position
    }

}