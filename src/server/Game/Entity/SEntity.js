Vector2D = require("../../../shared/Math/SVector2D");
typeCheck = require("../../../shared/Debugging/StypeCheck.js");

class SEntity {
    constructor(x, y, width, height) {
        this._pos = new Vector2D(x, y);
        this._vel = new Vector2D(0, 0);
        this._fric = new Vector2D(1, 1);
        this._acc = new Vector2D(0, 0);
        this._width = width;
        this._height = height;
        this._id = Math.random();

        // TODO: Add scalable function to add data pack
        // TODO: constants in the constructor.
        this._dataPack = {
            pos: this.pos, // Storing the reference is a good idea since
            vel: this.vel, // we don't have to waste performance with assignment
            width: this._width,
            height: this._height
        }
    }

    initFromEntityManager(entityManager) {

    }

    physics(/* TODO: Supply with parameters*/) {

    }

    update(entityManager) {

    }

    updateDataPack() {
        // TODO: Add updates if needed
        return this._dataPack;
    }

    // Getters and setters

    get id() {
        return this._id;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get topLeft() {
        return this._pos
    }

    get topRight() {
        return {
            x: this._pos.x + this._width,
            y : this._pos.y
        };
    }

    get bottomLeft() {
        return {
            x: this._pos.x,
            y : this._pos.y + this._height
        };
    }

    get bottomRight() {
        return {
            x: this._pos.x + this._width,
            y : this._pos.y + this._height
        };
    }

    get center() {
        return {
            x: this.pos.x + this.width / 2,
            y: this.pos.y + this.height / 2
        }
    }

    get pos() {
        return this._pos;
    }
    set pos(val) {

    }

    get vel() {
        return this._vel;
    }
    set vel(val) {

    }

    get acc() {
        return this._acc;
    }
    set acc(val) {

    }

    get fric() {
        return this._fric;
    }
    set fric(val) {

    }
}

module.exports = SEntity;