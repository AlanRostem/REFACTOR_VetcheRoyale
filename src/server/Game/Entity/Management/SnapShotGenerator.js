const typeCheck = require("../../../../shared/code/Debugging/StypeCheck.js");
const Entity = require("../SEntity.js");

// Class that composes all data pack
// exporting for every entity in the game.
class SnapShotGenerator {

    // The 2 last parameters are arrays with strings of the
    // entity's specified properties.
    constructor(composedEntity, referenceValues, dynamicValues = []) {

        // Pass in constants or reference objects that
        // are updated in referenceValues.

        // Pass in values that are not references but
        // require to be manually updated
        this._dynamicValues = dynamicValues;

        this._snapShot = {};

        this._snapShot.entityType = composedEntity.constructor.name;

        for (let key of referenceValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in reference values.");
            }
            this._snapShot[key] = composedEntity[key];
        }

        for (let key of dynamicValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in dynamic values.");
            }
            this._snapShot[key] = composedEntity[key];
        }
    }

    setStaticSnapshotData(key, value) {
        this._snapShot[key] = value;
    }

    // Map an array of strings with existing properties of the entity
    // to the snapshot object. These values are usually constant values
    // such as strings and numbers but also can also hold a reference to
    // an object that changes.
    addReferenceValues(composedEntity, referenceValues) {
        for (let key of referenceValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in reference values.");
            }

            if (this._snapShot.hasOwnProperty(key)) {
                throw new Error("Added duplicate reference value: " + key);
            }
            this._snapShot[key] = composedEntity[key];
        }
    }

    // Map an array of strings with existing properties of the entity
    // to the snapshot object. These values are manually iterated and
    // updated, that's why this function is suitable for singular values
    // of type number or string.
    addDynamicValues(composedEntity, dynamicValues) {
        for (let key of dynamicValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in dynamic values.");
            }

            if (this._snapShot.hasOwnProperty(key)) {
                throw new Error("Added duplicate dynamic value: " + key);
            }
            this._dynamicValues.push(key);
            this._snapShot[key] = composedEntity[key];
        }
    }

    update(entityManager, composedEntity, deltaTime) {
        this._snapShot.deltaTime = deltaTime;
        this._snapShot.timeStamp = entityManager.timeStamp;

        for (let key of this._dynamicValues) {
            this._snapShot[key] = composedEntity[key];
        }
    }

    export() {
        return this._snapShot;
    }

}

module.exports = SnapShotGenerator;