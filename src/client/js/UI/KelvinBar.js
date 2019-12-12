import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class KelvinBar extends UIElement {
    constructor() {
        super("kelvinbar", 0, 0, 32, 32);

        AssetManager.addSpriteCreationCallback(() => {
            this.kelvinGlassBar = AssetManager.getMapImage("kelvinGlassBar");
            this.kelvinGlassBarReady = AssetManager.getMapImage("kelvinGlassBarReady");

            this.drawBar = this.kelvinGlassBar;
            this.kelvinReady = AssetManager.getMapImage("kelvinReady");

            this.kelvinThinLiquid = AssetManager.getMapImage("kelvinThinLiquid");
            this.kelvinIcons = AssetManager.getMapImage("kelvinIcons");

            this.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.15);

            this.kelvinLiquidAnimation = new SpriteSheet("kelvinLiquidAnimation");
            this.kelvinLiquidAnimation.bind("liquid", 0, 0, 40, 8);

            this.ready = false;
        });

        this.hasWeapon = false;

    }

    update(deltaTime, client, entityList) {

        if (client.player) {
            let gun = entityList.getEntityByID(client.player.output.invWeaponID);
            if (gun) {
                this.iconID = gun.iconID;
                this.charge = gun.output.superChargeData;
                this.hasWeapon = true;
                (this.charge === 100 ? this.ready = true : this.ready = false);

            } else {
                this.charge = 0;
                this.hasWeapon = false;
            }

            if(this.ready) this.drawBar = this.kelvinGlassBarReady;
            else this.drawBar = this.kelvinGlassBar;
        }
    }

    draw() {
        if (this.hasWeapon) {

            R.ctx.save();

            let liquidLength = 40 * this.charge / 100 | 0;

            if(this.ready) {
                R.drawText("[Q]", R.WIDTH - this.kelvinGlassBar.width - 1, R.HEIGHT - this.kelvinGlassBar.height - 12, "White", false,320, true);

                R.drawCroppedImage(
                    this.kelvinReady,
                    0,
                    0,
                    this.kelvinReady.width,
                    this.kelvinReady.height,
                    R.WIDTH - this.kelvinReady.width - 6,
                    R.HEIGHT - 2 - this.kelvinGlassBar.height,
                    this.kelvinReady.width,
                    this.kelvinReady.height);
            }
            // Draw Glass Tube
            R.drawCroppedImage(
                this.drawBar,
                0,
                0,
                this.kelvinGlassBar.width,
                this.kelvinGlassBar.height,
                R.WIDTH - this.kelvinGlassBar.width - 4,
                R.HEIGHT - this.kelvinGlassBar.height - 4,
                this.kelvinGlassBar.width,
                this.kelvinGlassBar.height);

            // Ultimate icon
            R.drawCroppedImage(
                this.kelvinIcons,
                this.iconID * 8,
                0,
                8,
                8,
                R.WIDTH - 19,
                R.HEIGHT - 60,
                8,
                8
            );

            if (liquidLength === 0) {
                return;
            }

            // Liquid Inside
            R.drawCroppedImage(
                this.kelvinThinLiquid,
                0,
                this.kelvinThinLiquid.height - liquidLength,
                this.kelvinThinLiquid.width,
                liquidLength,
                R.WIDTH - this.kelvinGlassBar.width / 2 - this.kelvinThinLiquid.width / 2 - 4 | 0,
                R.HEIGHT - 6 - liquidLength,
                this.kelvinThinLiquid.width,
                liquidLength);

            if(!this.ready) {
                // Liquid Top
                this.kelvinLiquidAnimation.animate("liquid", this.animationSpec, 4, 8);
                this.kelvinLiquidAnimation.drawAnimated(
                    R.WIDTH - this.kelvinGlassBar.width + 5 | 0,
                    R.HEIGHT - 9 - liquidLength,
                    4,
                    8);
            }


            R.ctx.restore();
        }
    }
}
