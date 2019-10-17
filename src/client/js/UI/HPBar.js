import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class HPBar extends UIElement {
    constructor() {
        super("hpbar", 0, 0, 32, 32);

        AssetManager.addSpriteCreationCallback(() => {
            this.hpBarFrame = AssetManager.getMapImage("hpBarFrame");

            this.animation = new SpriteSheet.Animation(0, 11 - 1, 3, 0.1);

            this.hpAnimation = new SpriteSheet("hpBarGreenAnimation");
            this.hpAnimation.bind("HPLiquid", 0, 0, 150, 32);

        });

        this.HPjuice = new Vector2D(50, 8);

        this.HPlength = 0;

    }

    update(deltaTime, client, entityList) {
        if (client.player)
            this.HPlength = client.player.output.hp * this.HPjuice.x / 100 | 0;
    }

    draw() {
        R.ctx.save();

        if (this.HPlength === 0) {
            return;
        }

        // Liquid Top
        this.hpAnimation.animate("HPLiquid", this.animation, 50, 8);
        this.hpAnimation.drawCroppedAnimated(
            0,
            0,
            this.HPlength,
            this.HPjuice.y,
            6,
            R.HEIGHT - this.hpBarFrame.height - 2,
            this.HPlength,
            this.HPjuice.y);

        // Draw Glass Tube
        R.drawCroppedImage(
            this.hpBarFrame,
            0,
            0,
            this.hpBarFrame.width,
            this.hpBarFrame.height,
            4,
            R.HEIGHT - this.hpBarFrame.height - 4 | 0,
            this.hpBarFrame.width,
            this.hpBarFrame.height);

        R.ctx.restore();
    }

}