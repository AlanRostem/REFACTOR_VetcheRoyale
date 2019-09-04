import AssetManager from "../../AssetManager.js"

// Loads in a JSON file and creates a new object with its data
export default class JSONFile {
    constructor(src, downloadCallback) {
        this.src = src;
        this.fileContent = "";
        this.objectContent = {};
        var _this = this;
        AssetManager.addDownloadCallback(() => {
            _this.fileContent = AssetManager.get(src).string;
            _this.objectContent = AssetManager.get(src).object;
            downloadCallback(this.objectContent);
        });
    }

    get() {
        return this.objectContent;
    }
}

