import CLoot from "./CLoot.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../Graphics/Renderer.js";
import AssetManager from "../../AssetManager/AssetManager.js";
import CEntity from "./CEntity.js";
import EffectManager from "../../Graphics/EffectManager.js";
import AudioPool from "../../AssetManager/Classes/Audio/AudioPool.js";


export default class CLootCrate extends CLoot {
    static DISPLAY_NAME = "None";

    constructor(data) {
        super(data);
        this.level = this.output.level;

        switch (this.level) {
            case 1:
                this.type = "woodCrate";
                break;
            case 4:
                this.type = "metalCrate";
                break;
            case 3:
                this.type = "redMetalCrate";
                break;
        }


        if (AssetManager.getMapImage(this.type) === undefined)
            AssetManager.addSpriteCreationCallback(() => {
                this.img = AssetManager.getMapImage(this.type);
                this.selectImg = AssetManager.getMapImage(this.type + "_selected");
            });
        else this.img = AssetManager.getMapImage(this.type);
        this.selectImg = AssetManager.getMapImage(this.type + "_selected");

    }


    onClientDelete(client, data) {
        super.onClientDelete(client, data);
        EffectManager.createEffect(this.output.pos.x, this.output.pos.y - 2, this.type + "Open", 0);
        AudioPool.play("World/open_lootcrate.oggSE", this.output.pos);
    }


    updateFromDataPack(dataPack, client) {
        super.updateFromDataPack(dataPack, client);

    }

    update(deltaTime, client) {
        super.update(deltaTime, client);

    }

    draw() {
        super.draw();

        if (!this.isClose)
            R.drawCroppedImage(this.img,
                0, 0, 16, 10,
                this.output.pos.x, this.output.pos.y - 2, 16, 10, true);
        else {
            R.drawCroppedImage(this.selectImg,
                0, 0, 18, 12,
                this.output.pos.x - 1, this.output.pos.y - 3, 18, 12, true);

            R.drawText("[E]", this.output.pos.x, this.output.pos.y + 11, "White", true);

        }

    }
}

AssetManager.addSpriteCreationCallback(() => {

    EffectManager.configureEffect("woodCrateOpen", 0, 174, 16, 10, 7, 0.05);
    EffectManager.configureEffect("metalCrateOpen", 0, 184, 16, 10, 7, 0.05);
    EffectManager.configureEffect("redMetalCrateOpen", 0, 194, 16, 10, 7, 0.05);

});