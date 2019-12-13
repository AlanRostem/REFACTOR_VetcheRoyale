import CWeapon from "../CWeapon.js";
import Scene from "../../../Scene.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";

export default class CAquaSLG extends CWeapon {
    static DISPLAY_NAME = "AquaSLG";
    constructor(data) {
        super(data, 5);

        this.placeHolder = false;
        this.placeHolderSuper = false;

        this.waterDrawX = 0;
        this.waterDrawY = 0;
    }

    onReloadAction(client, deltaTime) {
        super.onReloadAction(client, deltaTime);
        this.reloadSnd = AudioPool.play("Weapons/aquaslg_reload.oggSE");
    }

    onDrop(client, deltaTime) {
        super.onDrop(client, deltaTime);
        if(this.reloadSnd) this.reloadSnd.stop();
    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);

        if (this.player) {
            this.waterDrawY = this.player.output.pos.y + this.player.output.height - 2;
            this.waterDrawX = this.player.output.pos.x;
        }
        this.secondaryUse = this.getRealtimeProperty("secondaryUse");
        this.superAbility = this.getRealtimeProperty("superAbilitySnap");

        if (this.effect) {
            this.effect.updatePos(this.waterDrawX, this.waterDrawY);
            if (this.effect.remove) this.effect = null;
        }

        if (this.secondaryUse && !this.placeHolder) {
            this.modSound = AudioPool.play("Weapons/aquaslg_mod.oggSE")
                .updatePanPos(this.output.pos);
        }

        if (this.placeHolderSuper && !this.superAbility) this.placeHolderSuper = false;

        if (!this.placeHolderSuper && this.superAbility) {
            AudioPool.play("Weapons/aquaslg_super.oggSE").updatePanPos(this.output.pos);
            this.effect2 = EffectManager.createEffect(this.player.output.pos.x - 64, this.player.output.pos.y + this.player.output.height - 64, "SteamBubble", 0);
            this.placeHolderSuper = true;
        }


        if (!this.secondaryUse && this.placeHolder) {
            this.effect = EffectManager.createEffect(this.waterDrawX, this.waterDrawY, "AquaWaterEnd", 0);
            this.placeHolder = false;
        }

        if (this.effect2) {
            //   this.effect2.updatePos(this.output.pos.x, this.output.pos.y);
            if (this.effect2.remove) this.effect2 = null;
        }

        if(this.modSound) this.modSound.updatePanPos(this.output.pos);

        super.update(deltaTime, client);
    }

    draw() {
        super.draw();
        R.ctx.save();
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

    EffectManager.configureEffect("AquaWaterEnd", 0, 24, 6, 6, 4, 0.07);
    EffectManager.configureEffect("SteamBubble", 0, 34, 128, 128, 8, 0.07);

});