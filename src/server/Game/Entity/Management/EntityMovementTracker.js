const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Composition class that tracks what movement state
// the Physical entity is in. The movement state
// management has to be performed manually by the
// entity.
class EntityMovementTracker {
    constructor() {
        this._currentMovementStates = new ONMap();
        this._movementStateCallbacks = new ONMap();
    }

    // Set a callback (or not) for certain movement states when they occur.
    addMovementStateListener(movementName, stateName, callback) {
        if (!this._movementStateCallbacks.has(movementName)) {
            this._movementStateCallbacks.set(movementName, new ONMap());
        }
        if (!this._currentMovementStates.has(movementName)) {
            this._currentMovementStates.set(movementName, stateName);
        }
        if (callback) {
            this._movementStateCallbacks.get(movementName).set(stateName, callback);
        }
    }

    update(composedEntity, entityManager, deltaTime) {

    }

    // Check if the entity is in a certain movement state.
    checkMovementState(movementName, stateName) {
        return this._currentMovementStates.get(movementName) === stateName;
    }

    // Set the movement state and perform the callback (if provided).
    setMovementState(movementName, stateName, composedEntity, entityManager, deltaTime) {
        this._currentMovementStates.set(movementName, stateName);
        if (this._movementStateCallbacks.has(movementName)) {
            if (this._movementStateCallbacks.get(movementName).has(stateName)) {
                this._movementStateCallbacks.get(movementName).get(stateName)
                    (movementName, stateName, composedEntity, entityManager, deltaTime);
            }
        }
    }

    // Use this as a data pack of movement states.
    get movementStates() {
        return this._currentMovementStates.object;
    }
}

module.exports = EntityMovementTracker;