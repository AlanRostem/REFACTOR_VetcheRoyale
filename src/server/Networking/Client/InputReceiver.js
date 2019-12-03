// Composite class that retrieves input data
// the client emitted to the server.


const PacketValidator = require("./PacketValidator.js");
const PacketBuffer = require("../PacketBuffer.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");

function validateInput(input) {
    // TODO:
    return true;
}

class InputReceiver {
    constructor(client) {
        // Holds all key states of corresponding key codes
        this.keyStates = {};
        // Holds all mouse states of corresponding mouse button numbers
        this.mouseStates = {};
        this.serverRef = null;
        this.inputDataToPlayer = {
            mouseStates: {},
            mouseData: {},
            keyStates: {},
        };

        client.socket.on("InputData", data => {
            if (PacketValidator.validateData(client, data, "object")) {
                if (validateInput(data))
                    this.applyInput(data, client);
            }
        });

        this.packetBuffer = new PacketBuffer();
        this.p = {
            mouseStates: {},
            mouseData: {
                x: 50,
                y: 100,
                world: {
                    x: 50,
                    y: 100
                }
            },
            keyStates: {"68":true},
        };
    }

    applyInput(input, client) {
        if (this.serverRef) {
            for (let key in input) {
            }
            this.inputDataToPlayer = PacketBuffer.mergeSnapshot(this.inputDataToPlayer, input);

            //console.log(this.p.keyStates, input.keyStates);

            this.serverRef.dataBridge.transferClientEvent("listenToInput", client.id, this.inputDataToPlayer);

            //if (this.inputDataToPlayer)
            //    console.log(this.inputDataToPlayer);
        }
    }

    hasPressedKey() {
        return Object.values(this.keyStates).indexOf(true) > -1
    }

    update(client, server) {
        if (!this.serverRef) {
            this.serverRef = server;
        }


    }
}

module.exports = InputReceiver;