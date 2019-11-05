import UIElement from "./UIElement.js";
import R from "../Graphics/Renderer.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import Scene from "../Game/Scene.js";

class EnemyDetector extends UIElement {
    constructor(x, y) {
        super("enemyDetector", x, y, 10, 10);
        this.found = {};
        this.maxFlashTime = .5;
        this.flashTime = 0;
        this.showScope = false;
    }

    showCentralPoint() {
        this.showScope = true;
    }

    queryPositions(positions) {
        this.found = positions;
    }

    draw() {
        super.draw();

        let enemies = Object.keys(this.found).length;
        let color = "Red";

        for (let id in this.found) {
            let pos = this.found[id];
            let disp = {};
            disp.x = pos.x + R.camera.x;
            disp.y = pos.y + R.camera.y;
            let offset = 5;
            let dim = 2;
            let push = 10;
            let pushX = 0;
            let pushY = 0;
            if (disp.x < 0) {
                disp.x = offset;
                pushX = push;
            }
            if (disp.y < 0) {
                disp.y = offset;
                pushY = push;
            }
            if (disp.x > R.screenSize.x) {
                disp.x = R.screenSize.x - offset;
                pushX = -push;
            }
            if (disp.y > R.screenSize.y) {
                disp.y = R.screenSize.y - offset;
                pushY = -push;
            }
            let distance = Vector2D.distance(Scene.clientRef.player.getRealtimeProperty("pos"), pos) / 8 | 0;
            R.drawText(distance + "m", disp.x + pushX - 5, disp.y + pushY, color);
            R.drawRect(color.toLowerCase(), disp.x, disp.y, dim, dim);
        }
        this.found = {};
        if (enemies > 0) {
            color = this.flashTime < this.maxFlashTime / 2 ? "Red" : "White";
            this.flashTime -= Scene.deltaTime;
            if (this.flashTime <= 0) {
                this.flashTime = this.maxFlashTime;
            }
            let string = "Enemy detected: " + enemies;
            R.drawText(string,
                R.screenSize.x / 2 - string.length * 2,
                R.screenSize.y / 2 - 16, color);
        }

        if (this.showScope) {
            R.drawRect("red", R.screenSize.x / 2, R.screenSize.y / 2 - 1, 1,1);
            R.drawRect("red", R.screenSize.x / 2 - 1, R.screenSize.y / 2, 1,1);
            R.drawRect("red", R.screenSize.x / 2 + 1, R.screenSize.y / 2, 1,1);
            R.drawRect("red", R.screenSize.x / 2, R.screenSize.y / 2 + 1, 1,1);
        }

        this.showScope = false;

    }

}

export default EnemyDetector;