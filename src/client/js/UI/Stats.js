import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class Stats extends UIElement {
    constructor() {
        super("stats", 0, 0, 32, 32);
        AssetManager.addSpriteCreationCallback(() => {
            this.stats = AssetManager.getMapImage("stats");
        });

        this.frame = new Vector2D(8, 8);

        this.killCount = 0;
        this.playersAlive = 0;


    }

    update(deltaTime, client, entityList) {
        if (client.player)
            if (client.player.output)
                if (client.player.output.statData)
                    this.killCount = client.player.output.statData.Kills;
        if (client.inboundPacket)
            if (client.inboundPacket.gameData) {
                this.playersAlive = client.inboundPacket.gameData.playerCount;
            }
    }


    draw() {
        R.ctx.save();

        // Players alive
        R.drawCroppedImage(
            this.stats,
            0,
            0,
            8,
            8,
            R.WIDTH - 36,
            R.HEIGHT - 122,
            8,
            8);

        R.drawText(this.playersAlive, R.WIDTH - 36 + 10, R.HEIGHT - 121, "White");

        // Kill Count
        R.drawCroppedImage(
            this.stats,
            8,
            0,
            8,
            8,
            R.WIDTH - 36,
            R.HEIGHT - 112,
            8,
            8);

        R.drawText(this.killCount, R.WIDTH - 36 + 10, R.HEIGHT - 120 + 9, "Red");

        R.ctx.restore();
    }
}
