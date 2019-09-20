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
        return new Promise((resolve, reject) => {
            const worker = new Worker(source, { workerData });
            worker.on('message', value => {
                resolve(value);
                this.onGetMessage(value);
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            })
        })
    }

    run() {
        let _this = this;
        (async function () {
            await _this.runService(_this.workerData, _this.source);
        })().catch(err => console.error(err));
    }
}


module.exports = Thread;