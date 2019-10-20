import CWeapon from "./CWeapon.js";
import Scene from "../../Scene.js";
import R from "../../../Graphics/Renderer.js";
import AssetManager from "../../../AssetManager/AssetManager.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import EffectManager from "../../../Graphics/EffectManager.js";

export default class CAquaSLG extends CWeapon {

    constructor(data) {
        super(data, 5);

        this.placeHolder = false;

        this.waterDrawX = 0;
        this.waterDrawY = 0;
    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);

    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);

        if (this.player) {
            this.waterDrawY = this.player.output.pos.y + this.player.output.height - 2;
            this.waterDrawX = this.player.output.pos.x;
            this.secondaryUse = this.getRealtimeProperty("secondaryUse");
        }


        super.update(deltaTime, client);
    }

    draw() {
        super.draw();
        R.ctx.save();

        if (!this.secondaryUse && this.placeHolder) {
            this.placeHolder = false;
            EffectManager.createEffect(this.waterDrawX, this.waterDrawY, "AquaWaterEnd", 0);
        }
        if (this.secondaryUse) {
            CAquaSLG.waterAnimation.animate("AquaWaterStart", CAquaSLG.animationSpec, 6, 6);
            CAquaSLG.waterAnimation.drawAnimated(
                this.waterDrawX + R.camera.x,
                this.waterDrawY + R.camera.y);
            this.placeHolder = true;
        }

        R.ctx.restore();
    }

}

AssetManager.addSpriteCreationCallback(() => {
    CAquaSLG.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.07);

    CAquaSLG.waterAnimation = new SpriteSheet("AquaSLGWaterAnimation");
    CAquaSLG.waterAnimation.bind("AquaWaterStart", 0, 0, 24, 6);

    EffectManager.configureEffect("AquaWaterEnd", 0, 24, 6, 6, 4, 0.1);

});