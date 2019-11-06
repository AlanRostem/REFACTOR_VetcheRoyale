import CEntity from "./CEntity.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../Graphics/Renderer.js";
import AudioPool from "../../AssetManager/Classes/Audio/AudioPool.js";
import AssetManager from "../../AssetManager/AssetManager.js";


export default class CPortal extends CEntity {
    constructor(d) {
        super(d);
        this.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.1);

    }

    onClientAdd(dataPack, client) {
        super.onClientAdd(dataPack, client);
        if (this.overlapLocalPlayer(client)
            || this.localPlayerOverlapsPair(client)
        ) {
            AudioPool.play("Map/portal.oggSE")
        }
    }

    localPlayerOverlapsPair(client) {
        if (client.player) {
            if (this.output.id === client.player.id)
                return false;
            let e = client.player;
            if (!this.output.pairData) {
                console.log("pair is returning null data");
                return false;
            }
            return this.output.pairData.pos.y + this.height > e.output.pos.y
                && this.output.pairData.pos.y < (e.output.pos.y + e.height)
                && this.output.pairData.pos.x + this.width > e.output.pos.x
                && this.output.pairData.pos.x < (e.output.pos.x + e.width);
        }
    }

    draw() {
        let pos = this.getRealtimeProperty("pos");

        CPortal.portalAnimation.animate("portal", this.animationSpec, 10, 16);
        CPortal.portalAnimation.drawAnimated(
            pos.x + R.camera.x - 1,
            pos.y + R.camera.y - 3, 10, 16);
    }

    update(deltaTime, client) {
        //let teleported = this.getRealtimeProperty("teleported");
        //if(teleported) AudioPool.play("Map/portal.oggSE");
        super.update(deltaTime, client);
    }
};


AssetManager.addSpriteCreationCallback(() => {
    CPortal.portalAnimation = new SpriteSheet("portal");
    CPortal.portalAnimation.bind("portal", 0, 0, 40, 16);
});