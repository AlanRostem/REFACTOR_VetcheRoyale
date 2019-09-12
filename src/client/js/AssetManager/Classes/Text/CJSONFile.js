import AssetManager from "../../AssetManager.js"

/**
 * Object that get .json files loaded and parsed by the asset manager
 * @see AssetManager
 */
class JSONFile {
    /**
     * @param src {string} - Relative file path made by the asset manager
     * @param downloadCallback {function} - Callback when the source is loaded by the asset manager
     */
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

    /**
     * Retrieve the parsed object data
     * @returns {object}
     */
    get() {
        return this.objectContent;
    }
}

export default JSONFile;