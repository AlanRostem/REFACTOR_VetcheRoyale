import CEntity from "../../CEntity.js";
import Scene from "../../../Scene.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import CProjectile from "../../CProjectile.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";

class CFirepellet extends CProjectile {

    constructor(data) {
        super(data);
        this.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.07);
        this.prePosX = this.output.pos.x;
        this.prePosY = this.output.pos.y;
    }

    onClientDelete(client, data) {
        super.onClientDelete(client, data);
        EffectManager.createEffect(this.output.pos.x, this.output.pos.y, "FirepelletHit", 0);
        AudioPool.play("Weapons/firewall_bulletHit.oggSE", this.output.pos);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);

        this.player = Scene.entityManager.getEntityByID(this.output.ownerID);

    }

    draw() {
        //super.draw();
        /*
                CFirepellet.bullet1Animation.animate("Firewall_bullet1", this.animationSpec, 14, 5);
                CFirepellet.bullet1Animation.drawAnimated(
                    this.output.pos.x + R.camera.x,
                    this.output.pos.y + R.camera.y);

             */
        /* R.drawCroppedImage(
             AssetManager.getMapImage("Firewall_bullet"),
             0,
             0,
             3,
             1,
             this.output.pos.x + 1,
             this.output.pos.y,
             3,
             1, true);

         */

        R.drawLine(this.output.pos.x, this.output.pos.y, this.prePosX, this.prePosY, "Orange", 1, true);
        R.drawRect("Yellow", this.output.pos.x, this.output.pos.y, 1, 1, true);

        this.prePosX = this.output.pos.x;
        this.prePosY = this.output.pos.y;
    }
}

export default CFirepellet;


AssetManager.addSpriteCreationCallback(() => {

    CFirepellet.bullet1Animation = new SpriteSheet("Firewall_bullet1");
    CFirepellet.bullet1Animation.bind("Firewall_bullet1", 0, 0, 14, 5);

    EffectManager.configureEffect("FirepelletHit", 0, 34, 4, 4, 4, 0.05);

});