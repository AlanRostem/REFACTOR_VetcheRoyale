import Scene from "./Game/Scene.js"

window.ping = () => {
    return Scene.clientRef.latency;
};

window.client = () => {
    return Scene.clientRef;
};

window.player = () => {
    return Scene.clientRef.player;
};

window.entities = () => {
    return Scene.entityManager.container;
};

export default {}