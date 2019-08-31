const PacketValidator = {
    speedLimitMS: 10,
    validatePacket(client, packet) {
        if (packet === null || packet === undefined) {
            client.disconnect("Invalid packet");
            return false;
        }
        /*
        if (client.frequencyBuffer.length >= 2) {
            if (Math.abs(client.frequencyBuffer[0] - client.frequencyBuffer[1]) < this.speedLimitMS / 1000) {
                client.disconnect("Attempted denial of service attack");
                return false;
            }
            client.frequencyBuffer.splice(0, 1);
        } else {
            client.frequencyBuffer.push(packet.receivalTimeStamp);
        }
        */

        return true;
    },
    validateData(client, data, expectedType) {
        if (data === null || data === undefined || typeof data !== expectedType) {
            client.disconnect("Invalid packet data");
            return false;
        }
        return true;
    }
};

module.exports = PacketValidator;