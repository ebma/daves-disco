import WebSocketHandler from "../WebSocketHandler"
import { MyClient } from "../../bot/MyClient"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import { initGuildHandlers } from "./guild"
import { initPlayerHandlers } from "./music"
import { initYoutubeHandlers } from "./youtube"

export function initHandlers(client: MyClient) {
  initGuildHandlers(client, WebSocketHandler)

  initYoutubeHandlers(WebSocketHandler)

  const musicPlayerManager = MusicPlayerManager
  initPlayerHandlers(client, WebSocketHandler, musicPlayerManager)
}
