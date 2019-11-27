import CEntity from "../../CEntity.js";
import Scene from "../../../Scene.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import Vector2D from "../../../../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import CProjectile from "../../CProjectile.js";

class CATBullet extends CProjectile {

    constructor(data) {
        super(data, "red");
        this.bulletSound = false;
        this.Xdirection = false;
        this.Ydirection = false;
        this.spdX = 3;
        this.spdY = 3;
        this.counter = 0;

        this.hit = false;
        this.alreadyHit = false;

        this.animationSpec = new SpriteSheet.Animation(0, 4, 5, 0.07);

    }

    onClientAdd(dataPack, client) {
        super.onClientAdd(dataPack, client);
        this.alreadyHit = this.output.vel.x === 0 && this.output.vel.y === 0;
    }

    onClientDelete(client) {
        super.onClientDelete(client);
        /*   EffectManager.createEffect(this.output.pos.x, this.output.pos.y, "IceBulletHit", 0);
           this.hitSound = AudioPool.play("Weapons/aquaslg_bullet_hit.oggSE")
               .updatePanPos(this.output.pos);*/
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);

        if (!this.bulletSound && !this.alreadyHit) {
            this.bulletSound = AudioPool.play("Weapons/cker90_shoot.oggSE");

        } else if (this.output.vel.x !== 0) {
            this.bulletSound.updatePanPos(this.output.pos);
        }

        if (this.output.vel.x > 0) this.Xdirection = true;
        if (this.output.vel.x < 0) this.Xdirection = false;
        if (this.output.vel.y > 0) this.Ydirection = true;
        if (this.output.vel.y < 0) this.Ydirection = false;

        if (this.output.vel.x === 0 && this.output.vel.y === 0) {
            if (!this.hit && !this.alreadyHit) {
                this.hit = true;
                AudioPool.play("Weapons/cker90_bullet_hit.oggSE");
                EffectManager.createEffect(this.output.pos.x - 4, this.output.pos.y - 4, "ATBulletHit", 0);
            }

            this.newPos = new Vector2D(this.output.pos.x + this.spdX * this.counter * (this.Xdirection ? 1 : -1), this.output.pos.y + this.spdY * this.counter * (this.Ydirection ? 1 : -1));
            if (!this.alreadyHit) {
                this.bulletSound.updatePanPos(this.newPos);
            }
            this.counter++;
        }

        this.player = Scene.entityManager.getEntityByID(this.output.ownerID);
    }

    draw() {
        super.draw();

        if (this.hit || this.alreadyHit) {
            CATBullet.sphereAnimation.animate("C-KER .90_bullet_search", this.animationSpec, 2, 2);
            CATBullet.sphereAnimation.drawAnimated(
                this.output.pos.x + R.camera.x,
                this.output.pos.y + R.camera.y);

        } else R.drawCroppedImage(
            AssetManager.getMapImage("C-KER .90_bullet"),
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

export default CATBullet;


AssetManager.addSpriteCreationCallback(() => {


});

AssetManager.addSpriteCreationCallback(() => {
    CATBullet.sphereAnimation = new SpriteSheet("C-KER .90_bullet_search");
    CATBullet.sphereAnimation.bind("C-KER .90_bullet_search", 0, 0, 10, 2);

    EffectManager.configureEffect("ATBulletHit", 36, 20, 10, 10, 8, 0.06);

});
