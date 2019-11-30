class SnapShotTemplate {
    constructor(constructor) {
        this.referenceTemplate = [];
        this.dynamicTemplate = [];
        this.currentConstructor = constructor.name;
    }

    // Map an array of strings with existing properties of the entity
    // to the snapshot object. These values are usually constant values
    // such as strings and numbers but also can also hold a reference to
    // an object that changes.
    addStaticValues(...referenceValues) {
        for (let key of referenceValues) {
            this.referenceTemplate.push(key)
        }
    }

    // Map an array of strings with existing properties of the entity
    // to the snapshot object. These values are manually iterated and
    // updated, that's why this function is suitable for singular values
    // of type number or string.
    addDynamicValues(...dynamicValues) {
        for (let key of dynamicValues) {
            this.dynamicTemplate.push(key)
        }
    }
}

module.exports = SnapShotTemplate;