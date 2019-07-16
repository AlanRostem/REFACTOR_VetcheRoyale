class AssetManager {

    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = {};
        this.downloadQueue = [];
        this.downloadCallbacks = [];
    }

    loadJSON(path, loadedCallback, failureCallback) {
        var text = {string: "", object: {}};
        fetch(path)
            .then(resp => {
                var json = resp.json();
                text.string = JSON.stringify(json);
                return json;
            })
            .then(data => {
                text.object = data;
                loadedCallback();
            });
        return text;
    }

    queue(path) {
        let rawFile = new XMLHttpRequest();
        var allText = "";
        const _this = this;
        rawFile.open("GET", path, true);
        rawFile.onreadystatechange = function () {
            switch (rawFile.readyState) {
                case 0 : // UNINITIALIZED
                case 1 : // LOADING
                case 2 : // LOADED
                case 3 : // INTERACTIVE
                    break;
                case 4 : // COMPLETED
                    allText = rawFile.responseText;
                    var lines = allText.split('\n');
                    for (var i = 0; i < lines.length; i++) {
                        lines[i] = lines[i].replace('\r', '');
                        _this.downloadQueue.push(lines[i]);
                    }

                    _this.download(() => {
                        for (var fun of _this.downloadCallbacks) {
                            fun();
                        }
                        console.log('%cThe program loaded in ' + (_this.successCount) + ' assets.', 'color: green; font-weight: bold;');
                        if (_this.errorCount > 0) console.error(_this.errorCount + " asset(s) failed to load.");
                    }, false);
                    break;
                default:
                    alert("error");
            }
        };
        rawFile.send(null);
    }

    download(downloadCallback) {
        if (this.downloadQueue.length === 0) {
            downloadCallback();
        }

        for (var i = 0; i < this.downloadQueue.length; i++) {
            var path = this.downloadQueue[i];
            var type = path.substring(path.lastIndexOf(('.')) + 1);
            const _this = this;

            switch (type) {
                case "ogg":
                    var audio = new Audio();
                    audio.addEventListener('canplaythrough', function () {
                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    }, false);

                    audio.addEventListener("error", function () {
                        _this.errorCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    }, false);

                    audio.src = "public/assets/audio/" + path;
                    this.cache[path] = audio;
                    break;
                case "png":
                    var img = new Image();
                    img.addEventListener("load", function () {
                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    }, false);
                    img.addEventListener("error", function () {
                        _this.errorCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    }, false);
                    img.src = "public/assets/img/" + path;
                    this.cache[path] = img;
                    break;
                case "json":
                    var txt = _this.loadJSON("shared/res/" + path, () => {
                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    }, () => {
                        _this.errorCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    });
                    this.cache[path] = txt;
                    break;
                default:
                    window.alert("FILENAME ERROR");
                    break;
            }
        }
    }

    done() {
        return (this.downloadQueue.length === this.successCount + this.errorCount);
    }

    get(path) {
        if(this.cache[path] === undefined) console.error("Resource not found (" + path + "), check if in cfg file!");
        return this.cache[path];
    }

    addDownloadCallback(callback) {
        this.downloadCallbacks.push(callback);
    }
}

const assMan = new AssetManager();
export default assMan;