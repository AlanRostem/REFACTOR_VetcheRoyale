import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

export default class Stats extends UIElement {
    constructor() {
        super("stats", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/ui.png");

        this.frame = new Vector2D(8, 8);

        this.killCount = 0;
        this.playersAlive = 0;

    }

    update(deltaTime, client, entityList) {
        if (client.player) {
            this.killCount = client.player.output.statData.Kills;
            this.playersAlive = client.player.output.gameData.playerCount;
        }
    }

    draw() {
        R.ctx.save();
        UIElement.defaultSpriteSheet.drawCropped(
            40,
            68,
            this.frame.x,
            this.frame.y,
            R.WIDTH - 36,
            R.HEIGHT - 122,
            this.frame.x,
            this.frame.y,
        );
        R.drawText(this.playersAlive, R.WIDTH - 36 + this.frame.x + 2, R.HEIGHT - 120, "White", false, 5);
        UIElement.defaultSpriteSheet.drawCropped(
            this.frame.x + 40,
            68,
            this.frame.x,
            this.frame.y,
            R.WIDTH - 36,
            R.HEIGHT - 122 + this.frame.y + 2,
            this.frame.x,
            this.frame.y,
        );
        R.drawText(this.killCount, R.WIDTH - 36 + this.frame.x + 2, R.HEIGHT - 120 + this.frame.y + 2, "Red");

        R.ctx.restore();
    }
}
