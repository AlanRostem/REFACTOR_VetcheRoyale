import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"
import Scene from "./Game/Scene.js"
import EntityDataReceiver from "./Game/Entity/Management/EntityDataReceiver.js"
import AssetManager from "./AssetManager/AssetManager.js";

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new EntityDataReceiver(client);
var assetManager = new AssetManager();
window.assetManager = assetManager;

assetManager.queue("client/config/audio.cfg");

R.setup();
Scene.run(entityDataReceiver, client);