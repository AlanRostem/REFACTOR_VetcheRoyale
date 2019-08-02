import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"
import Scene from "./Game/Scene.js"
import EntityDataReceiver from "./Networking/EntityDataReceiver.js"
import AssetManager from "./AssetManager/AssetManager.js";
import FontMaking from "./AssetManager/FontMaking.js";


// This is the initialization entry point

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new EntityDataReceiver(client);
window.entities = entityDataReceiver;

window.FontMaking = FontMaking;
window.AssetManager = AssetManager;
AssetManager.queue("client/config/assets.cfg");
FontMaking.queue();

R.setup();

Scene.run(entityDataReceiver, client);