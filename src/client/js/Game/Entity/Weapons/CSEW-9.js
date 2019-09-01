import CWeapon from "./CWeapon.js";
import R from "../../../Graphics/Renderer.js";

export default class CSEW_9 extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        if (this._output._modActive) {
            //R.camera.shift(this._output._misPos._x, this._output._misPos._y)
            R.camera.boundPos.x = this._output._misPos._x;
            R.camera.boundPos.y = this._output._misPos._y;
        }
    }
}
