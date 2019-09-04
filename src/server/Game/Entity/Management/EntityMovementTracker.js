const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Composition class that tracks what movement state
// the Physical entity is in. The movement state
// management has to be performed manually by the
// entity.
class EntityMovementTracker {
    constructor() {
        this.currentMovementStates = new ONMap();
        this.movementStateCallbacks = new ONMap();
    }

    // Set a callback (or not) for certain movement states when they occur.
    addMovementStateListener(movementName, stateName, callback) {
        if (!this.movementStateCallbacks.has(movementName)) {
            this.movementStateCallbacks.set(movementName, new ONMap());
        }
        if (!this.currentMovementStates.has(movementName)) {
            this.currentMovementStates.set(movementName, stateName);
        }
        if (callback) {
            this.movementStateCallbacks.get(movementName).set(stateName, callback);
        }
    }

    update(composedEntity, entityManager, deltaTime) {

    }

    // Check if the entity is in a certain movement state.
    checkMovementState(movementName, stateName) {
        return this.currentMovementStates.get(movementName) === stateName;
    }

    // Set the movement state and perform the callback (if provided).
    setMovementState(movementName, stateName, composedEntity, entityManager, deltaTime) {
        this.currentMovementStates.set(movementName, stateName);
        if (this.movementStateCallbacks.has(movementName)) {
            if (this.movementStateCallbacks.get(movementName).has(stateName)) {
                this.movementStateCallbacks.get(movementName).get(stateName)
                    (movementName, stateName, composedEntity, entityManager, deltaTime);
            }
        }
    }

    // Use this as a data pack of movement states.
    get movementStates() {
        return this.currentMovementStates.object;
    }
}

module.exports = EntityMovementTracker;