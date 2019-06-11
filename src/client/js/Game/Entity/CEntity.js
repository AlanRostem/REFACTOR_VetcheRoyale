// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Vector2D from "../../../../shared/Math/CVector2D.js";
export default class CEntity {
    constructor(initDataPack) {
        this._disPlayPos = new Vector2D(0, 0);
        for (var key in initDataPack) {
            this[key] = initDataPack[key];
        }
    }

    update(dataPack) {
        for (var key in dataPack) {
            this[key] = dataPack[key];
        }
        this._disPlayPos.x = this.pos._x | 0;
        this._disPlayPos.y = this.pos._y | 0;
    }

    draw() {
        R.drawRect(this.color, this._disPlayPos.x, this._disPlayPos.y, this.width, this.height);

        // TEST:
        R.context.save();
        R.context.beginPath();
        R.context.arc(this._disPlayPos.x + this.width / 2, this._disPlayPos.y + this.width / 2, this.t_entityProximity, 0, Math.PI * 2);
        R.context.strokeStyle = "yellow";
        R.context.lineWidth = 2;
        R.context.stroke();
        R.context.restore();
    }
}