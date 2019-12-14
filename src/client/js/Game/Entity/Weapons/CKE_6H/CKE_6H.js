import CWeapon from "../CWeapon.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";


export default class CKE_6H extends CWeapon {
    static DISPLAY_NAME = "KE-6H";

    constructor(data) {
        super(data, 2);
    }
    onReloadAction(client, deltaTime) {
        super.onReloadAction(client, deltaTime);
        this.reloadSnd = AudioPool.play("Weapons/ke-6h_r.oggSE");
    }

    onDrop(client, deltaTime) {
        super.onDrop(client, deltaTime);
        if(this.reloadSnd) this.reloadSnd.stop();
    }

    onModAbilityActivate(client, deltaTime) {
        super.onModAbilityActivate(client, deltaTime);
        AudioPool.play("Weapons/ke-6h_a.oggSE").updatePanPos(this.output.pos);
    }
}
