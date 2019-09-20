import CWeapon from "./CWeapon.js";
import R from "../../../Graphics/Renderer.js";

export default class CSEW_9 extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        if (this.output.modActive) {
            //R.camera.shift(this.output.misPos.x, this.output.misPos.y)
            R.camera.displayPos.x = this.output.misPos.x;
            R.camera.displayPos.y = this.output.misPos.y;
        }
    }
}
