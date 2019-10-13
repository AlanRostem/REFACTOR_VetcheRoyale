import CWeapon from "../CWeapon.js";
import R from "../../../../Graphics/Renderer.js";
import CVector2D from "../../../../../../shared/code/Math/CVector2D.js";

export default class CBIGMotorizer extends CWeapon {
    constructor(data) {
        super(data, 4);
    }

    draw() {
        super.draw();
        if (this.output.thunderPulsePos) {
            R.drawLine(
                new CVector2D(this.output.pos.x, this.output.pos.y),
                new CVector2D(this.output.thunderPulsePos.x, this.output.thunderPulsePos.y),
                1, "blue", 1, true);
        }
    }
}