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
            this.killCount = client.player.output._statData.Kills;
            this.playersAlive = client.player._output._gameData.playerCount;
        }
    }

    draw() {
            R.ctx.save();
            R.ctx.drawImage(this.src,
                0,
                92,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
                R.WIDTH - 36,
                R.HEIGHT - 122,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
            );
            R.drawText(this.playersAlive,R.WIDTH - 36 + this.frame.x + 2, R.HEIGHT - 120, "White", false, 5);
            R.ctx.drawImage(this.src,
                this.frame.x,
                92,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
                R.WIDTH - 36,
                R.HEIGHT - 122 + this.frame.y + 2,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
            );
            R.drawText(this.killCount,R.WIDTH - 36 + this.frame.x + 2, R.HEIGHT - 120 + this.frame.y + 2, "Red");

        R.ctx.restore();
    }
}
