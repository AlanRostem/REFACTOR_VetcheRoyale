let boxes = [];
let me;
let cellSpace;

function setup() {
    createCanvas(640, 640);
    for (let i = 0; i < 50; i++) {
        boxes.push(new Actor(width * Math.random(), height * Math.random(), 10, 10));
    }
    boxes.push(me = new Actor(width / 2, height / 2, 24, 24, color(255)));
    me.doIt = true;
    cellSpace = new SpatialHashGrid(width, height, 64, 64);
}

function mouseMoved() {
    me.move(mouseX - 12, mouseY - 12);
}

function draw() {
    background(150);
    for (let aabb of boxes) {
        aabb.update(cellSpace);
        aabb.draw();
        if (aabb.removed) {
            boxes.splice(boxes.indexOf(aabb), 1);
        }

    }
    cellSpace.draw();
}