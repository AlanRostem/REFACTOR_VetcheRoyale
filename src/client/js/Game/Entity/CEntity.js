// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
export default class CEntity {
    constructor(initDataPack) {
        for (var key in initDataPack) {
            this[key] = initDataPack[key];
        }
    }

    draw() {
        R.drawRect(this.color, this.pos.x, this.pos.y, this.width, this.height);
    }
}