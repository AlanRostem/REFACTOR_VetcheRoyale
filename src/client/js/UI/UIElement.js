import Vector2D from "../../../shared/code/Math/CVector2D.js";

export default class UIElement {
    constructor(name, x, y, w, h) {
        this.pos = new Vector2D(x, y);
        this.width = w;
        this.height = h;
        this.id = name;
    }

    update() {

    }

    draw() {

    }
}