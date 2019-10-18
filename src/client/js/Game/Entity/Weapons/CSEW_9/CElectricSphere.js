import CEntity from "../../CEntity.js";
import Scene from "../../../Scene.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import R from "../../../../Graphics/Renderer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";

class CElectricSphere extends CEntity {

    onClientDelete(client) {
        super.onClientDelete(client);
        R.camera.setConfig("followPlayer", true);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);


        if (this.getRealtimeProperty("ownerID") !== client.id) return;
        if (!this.getRealtimeProperty("secondary")) return;
        R.camera.setConfig("followPlayer", false);
        R.camera.setCurrentFollowPos(this.output.pos);
    }

    draw() {
        let pos = this.getRealtimeProperty("pos");

        CElectricSphere.sphereAnimation.animate("SEW-9_bullet", CElectricSphere.animationSpec, 5, 5);
        CElectricSphere.sphereAnimation.drawAnimated(
            pos.x + R.camera.x,
            pos.y + R.camera.y);
    }
}

AssetManager.addSpriteCreationCallback(() => {
    CElectricSphere.animationSpec = new SpriteSheet.Animation(0, 7, 8, 0.07);

    CElectricSphere.sphereAnimation = new SpriteSheet("SEW-9_bullet");
    CElectricSphere.sphereAnimation.bind("SEW-9_bullet", 0, 0, 40, 8);
});

export default CElectricSphere;