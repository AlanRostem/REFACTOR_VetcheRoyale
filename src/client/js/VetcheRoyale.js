import R from "./Graphics/Renderer.js"
import CClient from "./Networking/Client/CClient.js"
import Scene from "./Game/Scene.js"
import CEntityManager from "./Game/Entity/Management/CEntityManager.js"
import AssetManager from "./AssetManager/AssetManager.js";
import ConsoleCommands from "./ConsoleCommands.js";

/**
 * @namespace ClientSide
 */

// This is the initialization entry point

var client = new CClient(io("/game"));
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new CEntityManager(client);

window.AssetManager = AssetManager;
AssetManager.queue("client/config/assets.cfg");

R.setup();
Scene.run(entityDataReceiver, client);