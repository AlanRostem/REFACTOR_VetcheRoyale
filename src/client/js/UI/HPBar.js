import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

export default class HPBar extends UIElement {
    constructor() {
        super("hpbar", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/ui.png");

        this.glassTube = new Vector2D(54, 12); // Old 80 and 76
        this.HPjuice = new Vector2D(50, 8);

        this.HPlength = 0;
    }

    update(deltaTime, client, entityList) {
        this.HPlength = client.player.output.hp * this.HPjuice.x / 100 | 0;
    }

    draw() {
        R.ctx.save();

        if (this.HPlength === 0) {
            return;
        }

        // Liquid Inside
        UIElement.defaultSpriteSheet.drawCropped(
            0,
            this.glassTube.y,
            this.HPlength,
            this.HPjuice.y,
            6,
            R.HEIGHT - this.glassTube.y - 2,
            this.HPlength,
            this.HPjuice.y,
        );

        // Draw Glass Tube
        UIElement.defaultSpriteSheet.drawCropped(
            0,
            0,
            this.glassTube.x,
            this.glassTube.y,
            4,
            R.HEIGHT - this.glassTube.y - 4 | 0,
            this.glassTube.x,
            this.glassTube.y);

        R.ctx.restore();
    }

}