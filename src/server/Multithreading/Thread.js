const { Worker } = require('worker_threads');

class Thread {
    constructor(workerData, source) {
        this.workerData = workerData;
        this.source = source;
    }

    onGetMessage(message) {
        console.log(message)
    }

    runService(workerData, source) {
        const _this = this;
        return new Promise((resolve, reject) => {
            const worker = new Worker(source, { workerData });
            this.worker = worker;

            worker.on('message', value => {
                resolve(value);
                _this.onGetMessage(value);
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        })
    }

    sendDataToParent(data) {
        if (this.worker) {
            this.worker.postMessage(data);
        }
    }

    run() {
        let _this = this;
        (async function () {
            let test = await _this.runService(_this.workerData, _this.source);
            //console.log(test)
        })().catch(err => console.error(err));
    }
}


module.exports = Thread;