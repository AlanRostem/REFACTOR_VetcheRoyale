const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

class EntityMovementTracker {
    constructor() {
        this._currentMovementStates = new ONMap();
        this._movementStateCallbacks = new ONMap();
    }

    addMovementStateListener(movementName, stateName, callback) {
        if (!this._movementStateCallbacks.has(movementName)) {
            this._movementStateCallbacks.set(movementName, new ONMap());
        }
        if (!this._currentMovementStates.has(movementName)) {
            this._currentMovementStates.set(movementName, stateName);
        }
        this._movementStateCallbacks.get(movementName).set(stateName, callback);
    }

    update(composedEntity, entityManager, deltaTime) {
        //this.resetPerFrame(composedEntity, entityManager, deltaTime)
    }

    resetPerFrame(composedEntity, entityManager, deltaTime) {
        for (let stateName in this._currentMovementStates.object) {
            if (this._currentMovementStates.has(stateName)) {
                this.endMovementState(stateName);
            }
        }
    }

    setMovementState(movementName, stateName, composedEntity, entityManager, deltaTime) {
        this._currentMovementStates.set(movementName, stateName);
        if (this._movementStateCallbacks.has(movementName)) {
            if (this._movementStateCallbacks.get(movementName).has(stateName)) {
                this._movementStateCallbacks.get(movementName).get(stateName)
                    (movementName, stateName, composedEntity, entityManager, deltaTime);
            }
        }
    }

    get movementStates() {
        return this._currentMovementStates.object;
    }
}

module.exports = EntityMovementTracker;