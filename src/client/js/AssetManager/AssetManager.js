export default class AssetManager {

    constructor(){
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = {};
        this.downloadQueue = [];
    }

    queue(path){
        let rawFile = new XMLHttpRequest();
        var allText = "";
        const _this = this;
        rawFile.open("GET", path, true);
        rawFile.onreadystatechange = function ()
        {
            switch (rawFile.readyState) {
                case 0 : // UNINITIALIZED
                case 1 : // LOADING
                case 2 : // LOADED
                case 3 : // INTERACTIVE
                    break;
                case 4 : // COMPLETED
                    allText = rawFile.responseText;
                    var lines = allText.split('\n');
                    for (var i = 0; i<lines.length; i++) {
                       // console.log(lines[i][lines[i].length-1]);
                        lines[i] = lines[i].replace('\r', '');
                        _this.downloadQueue.push(lines[i]);
                    }
                    _this.download(function(){},false);
                    break;
                default: alert("error");
            }
        };
        rawFile.send(null);
    }

    download(downloadCallback)
    {
        if (this.downloadQueue.length === 0) {console.log(false); downloadCallback();}

        for(var i = 0; i < this.downloadQueue.length; i++) {
            var path = this.downloadQueue[i];
            var type = path.substring(path.lastIndexOf(('.'))+1);

            const _this = this;

            switch(type)
            {
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
                default: window.alert("FILENAME ERROR"); break;
            }
        }
    }

    done()
    {
        return (this.downloadQueue === this.successCount + this.errorCount);
    }

    get(path)
    {
        return this.cache[path];
    }
}
