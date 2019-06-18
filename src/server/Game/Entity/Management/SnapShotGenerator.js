// Class that should compose all data pack
// exporting for every entity in the game.

var typeCheck = require("../../../../shared/Debugging/StypeCheck.js");
var SEntity = require("../SEntity.js");

// TODO: Look at why including Entity apparently works...

class SnapShotGenerator {

    // The 2 last parameters are arrays with strings of the
    // entity's specified properties.
    constructor(composedEntity, referenceValues, dynamicValues = []) {
        typeCheck.instance(Entity, composedEntity);
        typeCheck.instance(Array, referenceValues);
        typeCheck.instance(Array, dynamicValues);

        // Pass in constants or reference objects that
        // are updated in referenceValues.

        // Pass in values that are not references but
        // require to be manually updated
        this._dynamicValues = dynamicValues;

        this._snapShot = {};
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

    addDynamicValues(composedEntity, dynamicValues) {
        for (let key of dynamicValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in reference values.");
            }

            if (this._snapShot.hasOwnProperty(key)) {
                throw new Error("Added duplicate dynamic value: " + key);
            }
            this._snapShot[key] = composedEntity[key];
            this._dynamicValues[key] = composedEntity[key];
        }
    }

    update(entityManager, composedEntity, deltaTime) {
        this._snapShot.deltaTime = deltaTime;
        this._snapShot.timeStamp = entityManager.timeStamp;

        for (let key in this._dynamicValues) {
            this._snapShot[key] = composedEntity[key];
        }

        console.l
    }

    export() {
        return this._snapShot;
    }

}

module.exports = SnapShotGenerator;