import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/Client/MyClient.js"
import Scene from "./Game/Scene.js"
import CEntityManager from "./Networking/Client/CEntityManager.js"
import AssetManager from "./AssetManager/AssetManager.js";
import FontMaking from "./AssetManager/FontMaking.js";
import ConsoleCommands from "./ConsoleCommands.js";

// This is the initialization entry point

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new CEntityManager(client);

window.FontMaking = FontMaking;
window.AssetManager = AssetManager;
AssetManager.queue("client/config/assets.cfg");
FontMaking.queue();

R.setup();

Scene.run(entityDataReceiver, client);