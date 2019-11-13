const PacketBuffer = require("../../../server/Networking/PacketBuffer.js");

class DataSelector {
    constructor(object, ...displayedProps) {
        this.selectedObject = object;

        // The properties per object within the selected object
        this.displayedProps = displayedProps;

        this.packetBuffer = new PacketBuffer();

        this.output = {};

        for (let key in this.selectedObject) {
            let content = this.selectedObject[key];
            this.output[key] = {};
            for (let prop of this.displayedProps) {
                this.output[key][prop] = Object.copy(content[prop]);
            }
        }
    }

    setDisplayedProperties(...args) {
        this.displayedProps = args;
    }

    selectObjectFromObject(prop) {
        this.selectedObject = this.selectedObject[prop];
    }

    export() {
        return this.packetBuffer.export(Object.keys(this.output), this.output);
    }
}

module.exports = DataSelector;