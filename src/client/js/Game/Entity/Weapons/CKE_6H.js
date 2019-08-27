import CWeapon from "./CWeapon.js";
import AssetManager from "../../../AssetManager/AssetManager.js"

export default class CKE_6H extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        AssetManager.get("Weapons/ke-6h_s.oggp");
    }
}
