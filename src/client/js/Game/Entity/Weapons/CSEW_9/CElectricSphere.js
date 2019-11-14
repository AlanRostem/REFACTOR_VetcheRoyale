import CEntity from "../../CEntity.js";
import Scene from "../../../Scene.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Timer from "../../../../../../shared/code/Tools/CTimer.js"

class CElectricSphere extends CEntity {

    constructor(data) {
        super(data);

        this.timer = new Timer(0.5, () => {this.drawStatic = true;}, true);
        this.timer2=  new Timer(0.75, () => {this.drawStatic = true;}, true);

        this.animationSpec = new SpriteSheet.Animation(0, 7, 8, 0.07);

    }

    onClientDelete(client) {
        super.onClientDelete(client);
        R.camera.setConfig("followPlayer", true);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);

        this.timer.tick(deltaTime);
        this.timer2.tick(deltaTime);

        this.player = Scene.entityManager.getEntityByID(this.output.ownerID);

        if (this.getRealtimeProperty("ownerID") !== client.id) return;
        if (!this.getRealtimeProperty("secondary")) return;
        R.camera.setConfig("followPlayer", false);
        R.camera.setCurrentFollowPos(this.output.pos);
    }

    draw() {

        let pos = this.getRealtimeProperty("pos");

        let player = this.player;

        CElectricSphere.sphereAnimation.animate("SEW-9_bullet", this.animationSpec, 5, 5);
        CElectricSphere.sphereAnimation.drawAnimated(
            pos.x + R.camera.x - 1,
            pos.y + R.camera.y - 1);

        if (!player) return;

        if(this.drawStatic) {
            lightningToPlayer(player.output.pos.x + player.output.width / 2, player.output.pos.y + player.output.height / 2, this.output.pos.x, this.output.pos.y, "White", 1, true);
            this.drawStatic = false;
        }
    }
}

AssetManager.addSpriteCreationCallback(() => {
    CElectricSphere.sphereAnimation = new SpriteSheet("SEW-9_bullet");
    CElectricSphere.sphereAnimation.bind("SEW-9_bullet", 0, 0, 40, 8);
});


function lightningToPlayer(x0, y0, x1, y1) {

    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    /*var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = (dx > dy ? dx : -dy) / 2;*/
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;

    var err = (dx > dy ? dx : -dy) / 2;

    while (true) {


        R.context.fillStyle = "White";
        R.context.fillRect(
            Math.round(x0 + (Math.random() * 3 + 1 | 0) + R.camera.x),
            Math.round(y0 + (Math.random() * 3 + 1 | 0) + R.camera.y), 1, 1);

        R.context.fillStyle = "Cyan";
        R.context.fillRect(
            Math.round(x0 + (Math.random() * 3 + 1 | 0) + R.camera.x),
            Math.round(y0 + (Math.random() * 3 + 1 | 0) + R.camera.y), 1, 1);
        if (x0 === x1 && y0 === y1) break;

        var e2 = err;
        if (e2 > -dx) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dy) {
            err += dx;
            y0 += sy;
        }
    }
}

export default CElectricSphere;