class UIElement {
    constructor(name, x, y, w, h) {
        this.pos = new Vector2D(x, y);
        this.width = w;
        this.height = h;
        UI.elements[name] = this;
    }

    update(){}

    draw() {}
}