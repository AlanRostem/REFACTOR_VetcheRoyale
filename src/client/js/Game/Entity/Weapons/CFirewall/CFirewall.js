import CWeapon from "../CWeapon.js";
import Scene from "../../../Scene.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";

export default class CFirewall extends CWeapon {
    static DISPLAY_NAME = "Firewall";

    constructor(data) {
        super(data, 6);
    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        AudioPool.play("Weapons/firewall_shoot.oggSE");
    }

    onReloadAction(client, deltaTime) {
        super.onReloadAction(client, deltaTime);
        this.reloadSnd = AudioPool.play("Weapons/firewall_reload.oggSE");
    }

    onDrop(client, deltaTime) {
        super.onDrop(client, deltaTime);
        if(this.reloadSnd) this.reloadSnd.stop();
    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);


        this.secondaryUse = this.getRealtimeProperty("secondaryUse");
        this.superAbility = this.getRealtimeProperty("superAbilitySnap");


        super.update(deltaTime, client);
    }

    draw() {
        super.draw();
        R.ctx.save();
        R.ctx.restore();
    }

}

AssetManager.addSpriteCreationCallback(() => {

});