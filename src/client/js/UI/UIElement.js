import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";


/**
 * An abstract class for UI elements
 */
class UIElement {
    /**
     *
     * @param name {string} - A string for the name of the UI element
     * @param x {int} - x position of the UI element
     * @param y {int} - y position of the UI element
     * @param w {int} - width of the UI element
     * @param h {int} - height of the UI element
     */
    constructor(name, x, y, w, h) {
        this.pos = new Vector2D(x, y);
        this.width = w;
        this.height = h;
        this.id = name;

    }

    /**
     *
     * @param deltaTime {int} - Deltatime between ticks
     * @param client {Client} - The client
     * @param entityList {EntityManager} - List of entities
     */
    update(deltaTime, client, entityList) {

    }

    /**
     *
     */
    draw() {

    }
}

UIElement.defaultSpriteSheet = new SpriteSheet("ui/ui.png");


export default UIElement;