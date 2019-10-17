import ONMap from "../../../shared/code/DataStructures/CObjectNotationMap.js";
import R from "../Graphics/Renderer.js";

/**
 * Singleton class managing assets by their file extension
 * @memberOf ClientSide

 */
class AssetManager {

    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = {};
        this.downloadQueue = [];
        this.downloadCallbacks = [];
        this.spriteCreationCallbacks = [];
        this.onFileDownloadedCallbacks = new ONMap;
        this.maxPool = 5;

        this.imageMap = {};

        // Web Audio API context:
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
    }

    /**
     * Map a callback function to a file path. The callback is executed when the particular file successfully loads
     * @param path {string} - File path to the mapped file
     * @param callback {function} - Callback when the particular file is loaded
     */
    mapFilePathCallback(path, callback) {
        this.onFileDownloadedCallbacks.set(path, callback);
    }

    /**
     * Loads (using fetch API) a .json file and parses it. The method returns pair with the json string and parsed object
     * @param path {string} - File path of the .json
     * @param loadedCallback {function} - Callback executed when successfully loading
     * @param failureCallback {function} - Callback executed when loading fails
     * @returns {{string: string, object: {}}}
     */
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

    /**
     * Queues assets from an asset configuration file to load and execute loading callbacks.
     * @param path {string} - File path to the configuration file containing all file names relative to the public/assets directory
     */
    queue(path) {
        window.consoleQueue = [];
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
                        if (lines[i] !== "end") _this.downloadQueue.push(lines[i]);
                        else {
                            i++;
                            break
                        }
                    }

                    _this.download(() => {
                        for (var fun of _this.downloadCallbacks) {
                            fun();
                        }
                        console.log('%cThe program loaded in ' + (_this.successCount) + ' assets.', 'color: green; font-weight: bold;');
                        if (_this.errorCount > 0) console.error(_this.errorCount + " asset(s) failed to load.");

                        for (; i < lines.length; i++) {
                            let split = lines[i].split(",");
                            _this.addMapImage(split[0], Number(split[1]), Number(split[2]), Number(split[3]), Number(split[4]));
                        }

                        for (let callback of _this.spriteCreationCallbacks) {
                            callback();
                        }
                    });
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
                    audio.testPath = path;
                    audio.addEventListener('canplaythrough', function () {
                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }

                        if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                            _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                            _this.onFileDownloadedCallbacks.remove(this.testPath);
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
                case "oggp":
                    path = path.slice(0, -1);
                    var cachePath = path + 'p';
                    this.cache[cachePath] = [];
                    var downloadAudio = new Audio();
                    downloadAudio.addEventListener('canplaythrough', function () {
                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }

                        if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                            _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                            _this.onFileDownloadedCallbacks.remove(this.testPath);
                        }
                    }, false);

                    downloadAudio.addEventListener("error", function () {
                        _this.errorCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    }, false);

                    downloadAudio.src = "public/assets/audio/" + path;
                    this.cache[cachePath] = downloadAudio;

                    break;
                case "oggSE":
                    path = path.slice(0, -2);
                    let request = new XMLHttpRequest();
                    request.open("GET", "public/assets/audio/" + path, true);
                    request.responseType = "arraybuffer";
                    request.audioPath = path + "SE";
                    request.onload = () => {
                        _this.audioCtx.decodeAudioData(request.response, buffer => {
                            _this.cache[request.audioPath] = buffer;
                        }, () => console.log("Audio loading error!"));

                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }

                        if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                            _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                            _this.onFileDownloadedCallbacks.remove(this.testPath);
                        }
                    };
                    request.send();
                    break;
                case "png":
                    var img = new Image();
                    img.testPath = path;
                    img.addEventListener("load", function () {
                        _this.successCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }

                        if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                            _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                            _this.onFileDownloadedCallbacks.remove(this.testPath);
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
                        if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                            _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                            _this.onFileDownloadedCallbacks.remove(this.testPath);
                        }
                    }, () => {
                        _this.errorCount++;
                        if (_this.done()) {
                            downloadCallback();
                        }
                    });
                    txt.testPath = path;
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

    /**
     * Retrieve an asset (DOM object) from the cache
     * @param path {string} - Relative file path
     * @returns {object}
     */
    get(path) {
        if (this.cache[path] === undefined) console.warn("Resource not loaded yet: (" + path + "), or check if in cfg file!");
        return this.cache[path];
    }

    addPainting(img, key) {
        this.cache[key] = img;
    }

    addMapImage(name, x, y, w, h) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(this.get("spriteSheet.png"), x, y, w, h, 0, 0, w, h);
        this.imageMap[name] = canvas;
    }

    addSpriteCreationCallback(callback) {
        this.spriteCreationCallbacks.push(callback)
    }

    getMapImage(name) {
        return this.imageMap[name];
    }

    setMapImage(name, image) {
        this.imageMap[name] = image;
    }

    /**
     * Add a callback function to the queue when all assets are downloaded in the queue
     * @param callback {function} - Callback function
     */
    addDownloadCallback(callback) {
        this.downloadCallbacks.push(callback);
    }
}

const assMan = new AssetManager();
export default assMan;