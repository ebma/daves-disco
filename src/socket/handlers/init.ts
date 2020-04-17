import WebSocketHandler from "../WebSocketHandler"
import { MyClient } from "../../bot/MyClient"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import { initPlayerHandlers } from "./music"

export function initHandlers(client: MyClient) {
  const musicPlayerManager = MusicPlayerManager
  initPlayerHandlers(client, WebSocketHandler, musicPlayerManager)
}
