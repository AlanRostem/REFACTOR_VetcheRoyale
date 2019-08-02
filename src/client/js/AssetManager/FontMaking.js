class FontMaking {

    constructor() {
        this.cache = {};
        this.downloadQueue = [];
        this.downloadCallbacks = [];

        this.W = 4;
        this.H = 5;

        // How to get reference from Asset manageren below

        this.fontImg = new Image();
        this.fontImg.src = "public/assets/img/fontMal.png";

    }

    queue() {
        let rawFile = new XMLHttpRequest();
        var allText = "";
        const _this = this;
        rawFile.open("GET", "client/config/symbols.cfg", true);
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
            var cv = document.createElement('canvas');
            var ctx = cv.getContext('2d');
            cv.width = this.W;
            cv.height = this.H;
            ctx.drawImage(this.fontImg, i % 8 * 4, Math.floor(i / 8) * 5, this.W, this.H, 0, 0, this.W, this.H);
            var img = new Image();
            img.src = cv.toDataURL();
            this.cache[path] = img;
            cv = null;
            ctx = null;
        }
    }

    get(path) {
        if (this.cache[path] === undefined) console.error("Resource not found (" + path + "), check if in cfg file!");
        return this.cache[path];
    }
}


const fontMan = new FontMaking();
export default fontMan;