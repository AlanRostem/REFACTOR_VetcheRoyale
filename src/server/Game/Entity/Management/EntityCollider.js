const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Composition class for Entity. Handles entity
// collisions based on the entity class type.

const EntityCollider = {
    _collisions: new ONMap(),

    applyCollisionsEffects(entity1, entity2, entityManager) {
        if (!this._collisions[entity2.constructor.name]) return;
        for (let callback of this._collisions.get(entity2.constructor.name)) {
            callback(entity1, entity2, entityManager);
        }
    },

    // Pass in the correct class constructor name (string)
    // to map the collision effect callback function.
    // The callback will have this layout:

    // addCollisionListener("EntityClass", (subject, entityManager) => { doStuff(); }

    addCollisionListener(classType, callback) {
        if (!this._collisions.has(classType)) {
            this._collisions.set(classType, [callback]);
        } else {
            this._collisions.get(classType).push(callback);
        }
    }
};

module.exports = EntityCollider;