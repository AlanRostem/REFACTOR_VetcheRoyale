import AssetManager from "../../AssetManager.js"

export default class JSONFile {
    constructor(src, downloadCallback) {
        this.src = src;
        this._fileContent = "";
        this._objectContent = {};
        var _this = this;
        AssetManager.addDownloadCallback(() => {
            _this._fileContent = AssetManager.get(src).string;
            _this._objectContent = AssetManager.get(src).object;
            downloadCallback(_this._objectContent);
        });
    }

    get() {
        return this._objectContent;
    }
}

