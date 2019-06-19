Vector2D = require("./SVector2D.js");

class SRect {
    constructor(x, y, w, h) {
        this.pos = new Vector2D(x, y);
        this.width = w;
        this.height = h;
    }
}

module.exports = SRect;