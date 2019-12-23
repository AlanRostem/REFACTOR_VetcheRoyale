import CLoot from "./CLoot.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../Graphics/Renderer.js";
import AssetManager from "../../AssetManager/AssetManager.js";
import CEntity from "./CEntity.js";

export default class CLootCrate extends CLoot {
    static DISPLAY_NAME = "None";

    constructor(data) {
        super(data);
        this.level = this.output.level;

        AssetManager.addSpriteCreationCallback(() => {

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

            this.img = AssetManager.getMapImage(this.type);
            this.selectImg = AssetManager.getMapImage(this.type + "_selected");
        })

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