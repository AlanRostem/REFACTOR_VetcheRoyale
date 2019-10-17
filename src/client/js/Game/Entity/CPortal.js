import CEntity from "./CEntity.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../Graphics/Renderer.js";
import AudioPool from "../../AssetManager/Classes/Audio/AudioPool.js";


export default class CPortal extends CEntity {
    constructor(d) {
        super(d);
        this.animation = new SpriteSheet.Animation(0, 3, 4, 0.1);
    }

    onClientAdd(dataPack, client) {
        super.onClientAdd(dataPack, client);
        if (this.overlapLocalPlayer(client)
            || this.localPlayerOverlapsPair(client)
        ) {
            AudioPool.play("Map/portal.oggSE")
        }
        console.log(this.output)
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
        CEntity.defaultSprite.animate("portal", this.animation, 10, 16);
        CEntity.defaultSprite.drawAnimated(
            pos.x + R.camera.x,
            pos.y + R.camera.y - 3, 10, 16);
    }

    update(deltaTime, client) {
        //let teleported = this.getRealtimeProperty("teleported");
        //if(teleported) AudioPool.play("Map/portal.oggSE");
        super.update(deltaTime, client);
    }
};

CEntity.defaultSprite.bind("portal", 0, 8, 10 * 4, 16);