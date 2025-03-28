const {Worker} = require('worker_threads');

class Thread {
    constructor(workerData, source) {
        this.workerData = workerData;
        this.source = source;
    }

    onGetMessage(message) {

    }

    runService(workerData, source) {
        const _this = this;
        return new Promise((resolve, reject) => {
            const worker = new Worker(source, {workerData});
            this.worker = worker;

            worker.on('message', value => {
                resolve(value);
                _this.onGetMessage(value);
            });
            worker.on('error', (value) => {
                reject(value);
                console.log(value)
            });
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }

    sendDataToParent(data) {
        if (this.worker) {
            this.worker.postMessage(data);
        }
    }

    run() {
        let _this = this;
        (async function () {
            await _this.runService(_this.workerData, _this.source);
        })().catch(err => console.error(err));
    }
}


module.exports = Thread;