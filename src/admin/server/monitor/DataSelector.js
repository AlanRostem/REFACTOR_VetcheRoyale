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

        this.output = {keys:this.displayedProps, data:{}};

        this.previousSelections = [];

        this.update();
    }

    selectObjectAndPropWithDisplay(specificKey, key, ...props) {
        if (this.selectedObject[key]) {
            this.selectedObject = this.selectedObject[key];
            this.selectObjectAndDisplayProps(specificKey, ...props);
        }
    }

    selectObjectAndDisplayProps(key, ...props) {
        if (this.selectedObject[key]) {
            this.previousSelections.push(new DataSelection(this.selectedObject, ...this.displayedProps));
            this.displayedProps = props;
            this.selectedObject = this.selectedObject[key];
            this.output = {keys:this.displayedProps, data:{}};
            this.packetBuffer.clear();
            this.update();
        }
    }

    reverseSelection() {
        let previous = this.previousSelections.pop();
        this.selectedObject = previous.object;
        this.displayedProps = previous.selectedProps;
    }

    update() {
        for (let key in this.selectedObject) {
            let content = this.selectedObject[key];
            this.output["data"][key] = {};
            for (let prop of this.displayedProps) {
                this.output["data"][key][prop] = Object.copy(content[prop]);
            }
        }
    }

    export() {
        return this.packetBuffer.export(Object.keys(this.output), this.output);
    }
}

module.exports = DataSelector;