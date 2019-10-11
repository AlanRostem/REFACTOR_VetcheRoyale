import CEntity from "../../CEntity.js";
import Scene from "../../../Scene.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import R from "../../../../Graphics/Renderer.js";

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
}

export default CElectricSphere;