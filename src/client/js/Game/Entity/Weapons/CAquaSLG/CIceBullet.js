import CEntity from "../../CEntity.js";
import Scene from "../../../Scene.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";

class CIceBullet extends CEntity {

    constructor(data) {
        super(data);

    }

    onClientDelete(client, data) {
        super.onClientDelete(client, data);
        //this.output.pos = data.pos;
        EffectManager.createEffect(this.output.pos.x, this.output.pos.y, "IceBulletHit", 0);
        this.hitSound = AudioPool.play("Weapons/aquaslg_bullet_hit.oggSE");
        this.hitSound.updatePanPos(this.output.pos);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);

        this.player = Scene.entityManager.getEntityByID(this.output.ownerID);

        if(this.hitSound) this.hitSound.updatePanPos(this.output.pos);
    }

    draw() {
        super.draw();
        R.drawCroppedImage(
            AssetManager.getMapImage("AquaSLG_bullet"),
            0,
            0,
            2,
            2,
            this.output.pos.x,
            this.output.pos.y,
            2,
            2, true);

    }
}

export default CIceBullet;


AssetManager.addSpriteCreationCallback(() => {

    EffectManager.configureEffect("IceBulletHit", 0, 30, 4, 4, 4, 0.05);

});