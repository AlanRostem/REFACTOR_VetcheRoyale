import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";

export default class GunBox extends UIElement {
    constructor() {
        super("gunbox", 0, 0, 32, 32);

        this.gunSprites = new SpriteSheet("ui/gunBoxGuns.png");

        this.frame = new Vector2D(64, 32);
        this.backGround = new Vector2D(60, 28);

        this.hasWeapon = false;

        this.playerAmmo = 0;
        this.loadedAmmo = 0;

    }

    update(deltaTime, client, entityList) {
        if (client.player) {
            let gun = entityList.getEntityByID(client.player.output.invWeaponID);
            if (gun) {
                this.hasWeapon = true;
                this.playerAmmo = client.player.output.invAmmo;
                this.loadedAmmo = gun.output.currentAmmo;
                this.iconID = gun.iconID;
            } else {
                this.hasWeapon = false;
            }
        }
    }

    draw() {

        if (this.hasWeapon) {
            R.ctx.save();

            R.drawText(this.loadedAmmo + "/" + this.playerAmmo, R.WIDTH - 72, R.HEIGHT - 44, "Green", false, 7);

            UIElement.defaultSpriteSheet.drawCropped(
                0,
                36,
                this.frame.x,
                this.frame.y,
                R.WIDTH - 92,
                R.HEIGHT - 36,
                this.frame.x,
                this.frame.y,
            );

            UIElement.defaultSpriteSheet.drawCropped(
                this.frame.x,
                36,
                this.backGround.x,
                this.backGround.y,
                R.WIDTH - 90,
                R.HEIGHT - 34,
                this.backGround.x,
                this.backGround.y,
            );

           this.gunSprites.drawCropped(
                0,
                this.iconID * this.backGround.y,
                this.backGround.x,
                this.backGround.y,
                R.WIDTH - 90,
                R.HEIGHT - 34,
                this.backGround.x,
                this.backGround.y,
            );

            R.ctx.restore();
        }

    }

}
