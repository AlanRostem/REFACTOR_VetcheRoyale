import AssetManager from "../../AssetManager.js"

export default class JSONFile {
    constructor(src, downloadCallback) {
        this.src = src;
        this._fileContent = "";
        this._objectContent = {};
        var _this = this;
        AssetManager.addDownloadCallback(() => {
            _this._fileContent = AssetManager.get(src).content;
            _this._objectContent = JSON.parse(
                _this._fileContent
            );
            downloadCallback(_this._objectContent);
        })
    }

    get() {
        return this._objectContent;
    }
}

