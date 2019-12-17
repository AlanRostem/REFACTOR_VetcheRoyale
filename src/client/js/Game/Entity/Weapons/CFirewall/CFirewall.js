import CWeapon from "../CWeapon.js";
import Scene from "../../../Scene.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";

export default class CFirewall extends CWeapon {

    constructor(data) {
        super(data, 6);
        this.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.09);
        this.animationSpec2 = new SpriteSheet.Animation(0, 1, 2, 0.09);

        this.fireEndPH = false;
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
        if (this.reloadSnd) this.reloadSnd.stop();
    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);

        let right = 0;
        if (this.player) right = (this.player.movementState.direction === "right") ? 0 : 1;

        this.secondaryUse = this.getRealtimeProperty("secondaryUse");
        this.superAbility = this.getRealtimeProperty("superAbilitySnap");
        this.wallWidth = this.getRealtimeProperty("wallWidth");

        if(this.hasUsedMod) this.fireEndPH = true;
        if(!this.hasUsedMod && this.fireEndPH) {
            this.fireEndPH = false;
            this.effect = EffectManager.createEffect(this.output.pos.x + (right ? - 64 : 0), this.output.pos.y, "FireEnd", 0);

        }

        super.update(deltaTime, client);
    }

    draw() {
        super.draw();
        let right = 0;
        if (this.player) right = (this.player.movementState.direction === "right") ? -1 : 1;

        if (right === 1) {
            CFirewall.fireAnimation1.flipX();
            CFirewall.fireAnimation2.flipX();
        }


        R.ctx.save();

        if (this.hasUsedMod) {
            CFirewall.fireAnimation1.animate("Firewall_superAni1", this.animationSpec, 64, 16);
            CFirewall.fireAnimation2.animate("Firewall_superAni2", this.animationSpec2, 16, 32);

            CFirewall.fireAnimation1.drawCroppedAnimated(
                0, 0,
                this.wallWidth, 16,
                this.output.pos.x + R.camera.x - (right === 1) * this.wallWidth + 2,
                this.output.pos.y - this.height / 2 + R.camera.y,
                this.wallWidth, 16
            );

            if (this.wallWidth < 64) {
                CFirewall.fireAnimation2.drawCroppedAnimated(
                    0, 0, 16, 32,
                    this.output.pos.x + R.camera.x - right * (this.wallWidth - 2) + (right > 0 ? 0 : - 12),
                    this.output.pos.y - this.height / 2 + R.camera.y - 8,
                    16, 32
                )
            }
        }

        R.ctx.restore();
    }

}

AssetManager.addSpriteCreationCallback(() => {
    CFirewall.fireAnimation1 = new SpriteSheet("Firewall_superAni1");
    CFirewall.fireAnimation1.bind("Firewall_superAni1", 0, 0, 64, 16);

    CFirewall.fireAnimation2 = new SpriteSheet("Firewall_superAni2");
    CFirewall.fireAnimation2.bind("Firewall_superAni2", 0, 0, 16, 32);

    EffectManager.configureEffect("FireEnd", 432, 0, 64, 16, 4, 0.09);
});