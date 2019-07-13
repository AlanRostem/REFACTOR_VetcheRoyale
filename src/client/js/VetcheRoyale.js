import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"
import Scene from "./Game/Scene.js"
import EntityDataReceiver from "./Game/Entity/Management/EntityDataReceiver.js"
import AssetManager from "./AssetManager/AssetManager.js";
import TileSheet from "./AssetManager/Classes/Graphical/TileSheet.js";
import UI from "./UI/UI.js";
import MiniMap from "./UI/MiniMap.js";
import KelvinBar from "./UI/KelvinBar.js";

// This is the initialization entry point

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new EntityDataReceiver(client);
window.entities = entityDataReceiver;

window.AssetManager = AssetManager;
AssetManager.queue("client/config/assets.cfg");

R.setup();

Scene.run(entityDataReceiver, client);