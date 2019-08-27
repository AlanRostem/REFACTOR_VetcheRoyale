import CWeapon from "./CWeapon.js";

export default class CBIGMotorizer extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        AssetManager.get("Weapons/motorizer_s.oggp");
    }
}