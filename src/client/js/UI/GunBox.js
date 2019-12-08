import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class GunBox extends UIElement {
    constructor() {
        super("gunbox", 0, 0, 32, 32);

        AssetManager.addSpriteCreationCallback(() => {
            this.gunBoxFrame = AssetManager.getMapImage("gunBoxFrame");
            this.gunBoxBackground = AssetManager.getMapImage("gunBoxBackground");

            this.animationSpec = new SpriteSheet.Animation(0, 6, 7, 0.1);

            this.gunAnimation = new SpriteSheet("SEW-9");
            this.gunAnimation.bind("gunStandby", 0, 0, 60 * 7, 26);

            this.animationBG = new SpriteSheet.Animation(0, 5, 6, 0.1);

            this.gunBoxBackgroundAnimation = new SpriteSheet("gunBoxBackgroundAnimation");
            this.gunBoxBackgroundAnimation.bind("gunBoxBackgroundAnimation", 0, 0, 60, 28);
        });

        this.playerAmmo = 0;
        this.loadedAmmo = 0;

        this.oldName = null;

        this.isReloading = false;
        this.hasWeapon = false;

    }

    update(deltaTime, client, entityList) {
        if (client.player) {
            let gun = entityList.getEntityByID(client.player.output.invWeaponID);
            if (gun) {
                this.iconName = gun.output.displayName;
                if (this.iconName !== this.oldName) {
                    this.gunAnimation.img = AssetManager.getMapImage(this.iconName);
                    this.oldName = this.iconName;
                }
                this.hasWeapon = true;
                this.playerAmmo = client.player.output.invAmmo;
                this.loadedAmmo = gun.output.currentAmmo;
                this.isReloading = gun.output.reloading;
                if (this.isReloading) {
                    if (!gun.hasPressedReloadKey) {
                        gun.onReloadAction(client, deltaTime);
                        gun.hasPressedReloadKey = true;
                    }
                } else {
                    gun.hasPressedReloadKey = false;
                }
            } else {
                this.hasWeapon = false;
            }
        }
    }

    draw() {

        if (this.hasWeapon) {
            R.ctx.save();

            // Ammo Info
            R.drawText((this.isReloading ? "Reloading..." : this.loadedAmmo + "/" + this.playerAmmo), R.WIDTH - (this.isReloading ? 88 : 72), R.HEIGHT - 44, "Green");

            // Gunboxframe
            R.drawCroppedImage(
                this.gunBoxFrame,
                0,
                0,
                this.gunBoxFrame.width,
                this.gunBoxFrame.height,
                R.WIDTH - 92,
                R.HEIGHT - 36,
                this.gunBoxFrame.width,
                this.gunBoxFrame.height
            );

          /*  // Gunbox Background
            R.drawCroppedImage(
                this.gunBoxBackground,
                0,
                0,
                this.gunBoxBackground.width,
                this.gunBoxBackground.height,
                R.WIDTH - 90,
                R.HEIGHT - 34,
                this.gunBoxBackground.width,
                this.gunBoxBackground.height
            );*/


            this.gunBoxBackgroundAnimation.animate("gunBoxBackgroundAnimation", this.animationBG, this.gunBoxBackground.width, this.gunBoxBackground.height);
            this.gunBoxBackgroundAnimation.drawCroppedAnimated(
                0,
                0,
                this.gunBoxBackground.width,
                this.gunBoxBackground.height,
                R.WIDTH - 90,
                R.HEIGHT - 34,
                this.gunBoxBackground.width,
                this.gunBoxBackground.height);

            // Gun inside box
            this.gunAnimation.animate("gunStandby", this.animationSpec, this.gunBoxBackground.width, this.gunBoxBackground.height);
            this.gunAnimation.drawCroppedAnimated(
                0,
                0,
                this.gunBoxBackground.width,
                this.gunBoxBackground.height,
                R.WIDTH - 90,
                R.HEIGHT - 34,
                this.gunBoxBackground.width,
                this.gunBoxBackground.height);

            R.ctx.restore();
        }

    }

}
