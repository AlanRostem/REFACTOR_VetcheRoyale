const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Composition object for Entity. Handles entity
// collisions based on the entity class type.

// TODO: Finish this code and use it.

const EntityCollider = {
    collisions: new ONMap(),

    applyCollisionsEffects(entity1, entity2, entityManager) {
        if (!this.collisions.has(entity1.constructor.name)) return;
        for (let callback of this.collisions.get(entity2.constructor.name)) {
            callback(entity1, entity2, entityManager);
        }
    },

    // Pass in the correct class constructor name (string)
    // to map the tileCollision effect callback function.
    // The callback will have this layout:

    // addCollisionListener("EntityClass", (subject, entityManager) => { doStuff(); }

    addCollisionListener(classType, callback) {
        if (!this.collisions.has(classType)) {
            this.collisions.set(classType, [callback]);
        } else {
            this.collisions.get(classType).push(callback);
        }
    }
};

module.exports = EntityCollider;