// Collision handler for entities with different
// actions based on different collisions.

class EntityCollisionCompositor {
    constructor(entity) {
        this._entRef = entity;
        this._collisions = {};
    }

    applyCollisionsEffects(entity) {
        if (!this._collisions[entity.constructor.name]) return;
        for (let callback of this._collisions[entity.constructor.name]) {
            callback(this._entRef, entity);
        }
    }

    // Pass in the correct class constructor name (string)
    // to map the collision effect callback function.
    // The callback will have this layout:

    // addCollisionListener("EntityClass", (self, subject) => { doStuff(); }

    addCollisionListener(classType, callback) {
        if (!this._collisions[classType]) {
            this._collisions[classType] = [callback];
        } else {
            this._collisions[classType].push(callback);
        }
    }
}

module.exports = EntityCollisionCompositor;