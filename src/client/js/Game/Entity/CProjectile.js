import CEntity from "./CEntity.js";

class CProjectile extends CEntity {

    constructor(d, lineColor = "white") {
        super(d);
        this.lineColor = lineColor;
    }

    draw() {
        super.draw();
        R.drawLine(
            this.center.x - this.output.vel.x * 1/Scene.clientRef.tickRate,
            this.center.y - this.output.vel.y * 1/Scene.clientRef.tickRate,
            this.center.x, this.center.y, this.lineColor, 1, true);
    }
}

export default CProjectile;