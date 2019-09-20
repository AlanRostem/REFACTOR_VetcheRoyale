import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";

export default class UIElement {
    constructor(name, x, y, w, h) {
        this.pos = new Vector2D(x, y);
        this.width = w;
        this.height = h;
        this.id = name;
    }

    update(deltaTime, client, entityList) {

    }

    draw() {

    }
}

UIElement.defaultSpriteSheet = new SpriteSheet("ui/ui.png");