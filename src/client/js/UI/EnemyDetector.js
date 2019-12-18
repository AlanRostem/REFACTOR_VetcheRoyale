import UIElement from "./UIElement.js";
import R from "../Graphics/Renderer.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import Scene from "../Game/Scene.js";
import CHitScanner from "../Game/Entity/Player/CHitScanner.js";

class EnemyDetector extends UIElement {
    constructor(x, y) {
        super("enemyDetector", x, y, 10, 10);
        this.found = {};
        this.maxFlashTime = .5;
        this.flashTime = 0;
        this.showScope = false;
        this.lineScanner = new CHitScanner();
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
        if (enemies > 0) {
            color = this.flashTime < this.maxFlashTime / 2 ? "Red" : "White";
            this.flashTime -= Scene.deltaTime;
            if (this.flashTime <= 0) {
                this.flashTime = this.maxFlashTime;
            }
            let string = "Enemy detected: " + enemies;
            //console.log("FROM DETECTOR", this.found)
            R.drawText(string,
                R.screenSize.x / 2 - string.length * 2,
                R.screenSize.y / 3 - 16, color);
        }

        this.found = {};

        if (this.showScope) {
            R.drawRect("red", R.screenSize.x / 2, R.screenSize.y / 2 - 1, 1, 1);
            R.drawRect("red", R.screenSize.x / 2 - 1, R.screenSize.y / 2, 1, 1);
            R.drawRect("red", R.screenSize.x / 2 + 1, R.screenSize.y / 2, 1, 1);
            R.drawRect("red", R.screenSize.x / 2, R.screenSize.y / 2 + 1, 1, 1);
            let p0 = {
                x: Scene.clientRef.player.output.pos.x + Scene.clientRef.player.width / 2,
                y: Scene.clientRef.player.output.pos.y + Scene.clientRef.player.height / 2,
            };
            let p1 = {
                x: R.screenSize.x / 2 - R.camera.x,
                y: R.screenSize.y / 2 - R.camera.y,
            };

            this.lineScanner.scan(p0, p1, Scene.getCurrentTileMap());

            R.drawLine(
                p0.x + R.camera.x, p0.y + R.camera.y,
                this.lineScanner.end.x + R.camera.x, this.lineScanner.end.y + R.camera.y,
                "Red", 1, false, 10
            );
        }

        this.showScope = false;

    }

}

export default EnemyDetector;