import WebSocketHandler from "./WebSocketHandler"
import { MyClient } from "../MyClient"
import MusicPlayerManager from "../libs/MusicPlayerManager"
import { initGuildHandlers } from "./handlers/guild"
import { initPlayerHandlers } from "./handlers/music"

export function initHandlers(client: MyClient) {
  initGuildHandlers(client, WebSocketHandler)

  const musicPlayerManager = MusicPlayerManager
  initPlayerHandlers(client, WebSocketHandler, musicPlayerManager)
}
