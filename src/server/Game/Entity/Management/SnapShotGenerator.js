const typeCheck = require("../../../../shared/code/Debugging/StypeCheck.js");
const Entity = require("../SEntity.js");
const PacketBuffer = require("../../../Networking/PacketBuffer");

// Class that composes all data pack
// exporting for every entity in the game.

class SnapShotGenerator{
    // The 2 last parameters are arrays with strings of the
    // entity's specified properties.
    constructor(composedEntity, constValues, dynamicValues = []) {

        // Pass in constants or reference objects that
        // are updated in referenceValues.

        // Pass in values that are not references but
        // require to be manually updated
        this.dynamicValues = dynamicValues;

        this.packetBuffer = new PacketBuffer;

        this.snapShot = {
            init: {},
            dynamic: {}
        };

        this.composedEntity = composedEntity;

        this.snapShot.init.entityType = composedEntity.constructor.name;

        for (let key of constValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in reference values.");
            }

            this.snapShot.init[key] = composedEntity[key];
        }

        for (let key of dynamicValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in dynamic values.");
            }
            this.snapShot.dynamic[key] = composedEntity[key];
        }
    }

    removeStaticSnapshotData(key) {
        delete this.snapShot[key];
    }

    removeDynamicSnapshotData(key) {
        delete this.snapShot[key];
        let i = this.dynamicValues.indexOf(key);
        this.dynamicValues.splice(i);
    }

    setStaticSnapshotData(key, value) {
        this.snapShot[key] = value;
    }

    // Map an array of strings with existing properties of the entity
    // to the snapshot object. These values are usually constant values
    // such as strings and numbers but also can also hold a reference to
    // an object that changes.
    addStaticValues(composedEntity, referenceValues) {
        for (let key of referenceValues) {
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in reference values.");
            }


            if (this.snapShot.hasOwnProperty(key)) {
                throw new Error("Added duplicate reference value: " + key);
            }
            this.snapShot.init[key] = composedEntity[key];
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

            if (this.snapShot.hasOwnProperty(key)) {
                throw new Error("Added duplicate dynamic value: " + key);
            }
            this.dynamicValues.push(key);
            this.snapShot.dynamic[key] = composedEntity[key];
        }
    }

    update(entityManager, composedEntity, deltaTime) {
        //this.snapShot.deltaTime = deltaTime;
        //this.snapShot.serverTimeStamp = Date.now();

        this.snapShot.dynamic = this.packetBuffer.export(this.dynamicValues, composedEntity);

    }

    exportInitValues() {
        this.snapShot.dynamic = this.packetBuffer.exportInitValues(this.dynamicValues, this.composedEntity);
        return this.snapShot;
    }

    export() {
        return this.snapShot.dynamic;
    }

}

module.exports = SnapShotGenerator;