import R from "./Graphics/Renderer.js"
import CClient from "./Networking/Client/CClient.js"
import Scene from "./Game/Scene.js"
import CEntityManager from "./Networking/Client/CEntityManager.js"
import AssetManager from "./AssetManager/AssetManager.js";
import FontMaking from "./AssetManager/FontMaking.js";
import ConsoleCommands from "./ConsoleCommands.js";
import typeCheck from "../../shared/code/Debugging/CtypeCheck.js";

// This is the initialization entry point

var client = new CClient(io());
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new CEntityManager(client);

window.FontMaking = FontMaking;
window.AssetManager = AssetManager;
AssetManager.queue("client/config/assets.cfg");
FontMaking.queue();

R.setup();

Scene.run(entityDataReceiver, client);
console.log("Time it took to load all files:", Math.abs(Date.now() - typeCheck.timeSinceStart));