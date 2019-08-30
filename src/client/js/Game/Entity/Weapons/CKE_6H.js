import CWeapon from "./CWeapon.js";
import SoundManager from "../../../AssetManager/Classes/Audio/SoundManager.js";

export default class CKE_6H extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        SoundManager.play("Weapons/ke-6h_s.oggSE");
    }
}
