import WebSocketHandler from "../WebSocketHandler"
import { MyClient } from "../../bot/MyClient"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import { initGuildHandlers } from "./guild"
import { initPlayerHandlers } from "./music"

export function initHandlers(client: MyClient) {
  initGuildHandlers(client, WebSocketHandler)

  const musicPlayerManager = MusicPlayerManager
  initPlayerHandlers(client, WebSocketHandler, musicPlayerManager)
}
