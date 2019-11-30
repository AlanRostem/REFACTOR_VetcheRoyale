const typeCheck = require("../../../../shared/code/Debugging/StypeCheck.js");
const Entity = require("../SEntity.js");
const PacketBuffer = require("../../../Networking/PacketBuffer");

// Class that composes all data pack
// exporting for every entity in the game.

class SnapShotGenerator{
    // The 2 last parameters are arrays with strings of the
    // entity's specified properties.
    constructor(composedEntity) {

        // Pass in constants or reference objects that
        // are updated in referenceValues.

        // Pass in values that are not references but
        // require to be manually updated
        this.dynamicValues = composedEntity.constructor.SNAPSHOT_TEMPLATE.dynamicTemplate;

        this.packetBuffer = new PacketBuffer;

        this.snapShot = {
            init: {},
            dynamic: {}
        };

        this.composedEntity = composedEntity;

        this.snapShot.init.entityType = composedEntity.constructor.name;

        for (let key of composedEntity.constructor.SNAPSHOT_TEMPLATE.referenceTemplate) {
            /*
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in reference values.");
            }
             */
            this.snapShot.init[key] = composedEntity[key];
        }

        for (let key of this.dynamicValues) {
            /*
            if (!composedEntity.hasOwnProperty(key)) {
                throw new Error(composedEntity.constructor.name +
                    " does not have property " + key + " in dynamic values.");
            }
             */
            this.snapShot.dynamic[key] = composedEntity[key];
        }
    }

    removeStaticSnapshotData(key) {
        delete this.snapShot[key];
    }

    removeDynamicSnapshotData(key) {
        delete this.snapShot[key];
        let i = this.dynamicValues.indexOf(key);
        this.dynamicValues.splice(i, 1);
    }

    setStaticSnapshotData(key, value) {
        this.snapShot[key] = value;
    }

    update(entityManager, composedEntity, deltaTime) {
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