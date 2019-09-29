import CWeapon from "./CWeapon.js";
import SoundManager from "../../../AssetManager/Classes/Audio/SoundManager.js";
import R from "../../../Graphics/Renderer.js";
import CVector2D from "../../../../../shared/code/Math/CVector2D.js";

export default class CBIGMotorizer extends CWeapon {
    constructor(data)
    {
        super(data, 3);
    }
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        SoundManager.play("Weapons/motorizer_s.oggSE");
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