import CWeapon from "./CWeapon.js";
import SoundManager from "../../../AssetManager/Classes/Audio/SoundManager.js";

export default class CBIGMotorizer extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        SoundManager.play("Weapons/motorizer_s.oggSE");
    }
}