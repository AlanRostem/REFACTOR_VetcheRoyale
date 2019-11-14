const PacketBuffer = require("../../../server/Networking/PacketBuffer.js");

class DataSelection {
    constructor(object, ...selectedProps) {
        this.object = object;
        this.selectedProps = selectedProps;
    }
}

class DataSelector {
    constructor(object, ...displayedProps) {
        this.selectedObject = object;

        // The properties per object within the selected object
        this.displayedProps = displayedProps;

        this.packetBuffer = new PacketBuffer();

        this.output = {};

        this.previousSelections = [];

        this.update();
    }

    selectObjectAndDisplayProps(key, ...props) {
        this.previousSelections.push(new DataSelection(this.selectedObject, ...this.displayedProps));
        this.displayedProps = props;
        this.selectedObject = this.selectedObject[key];
    }

    reverseSelection() {
        let previous = this.previousSelections.pop();
        this.selectedObject = previous.object;
        this.displayedProps = previous.selectedProps;
    }

    update() {
        for (let key in this.selectedObject) {
            let content = this.selectedObject[key];
            this.output[key] = {};
            for (let prop of this.displayedProps) {
                this.output[key][prop] = Object.copy(content[prop]);
            }
        }
    }

    export() {
        return this.packetBuffer.export(Object.keys(this.output), this.output);
    }
}

module.exports = DataSelector;