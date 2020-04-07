import { Server } from "http"
import socketio, { Socket } from "socket.io"
import socketioJwt from "socketio-jwt"
import config from "../utils/config"
import { MyClient } from "../bot/MyClient"
import { initHandlers } from "./handlers/init"
import WebSocketHandler from "./WebSocketHandler"

function initializeSocket(socket: Socket) {
  WebSocketHandler.addSocket(socket)
}

export function startSocketConnection(server: Server, client: MyClient) {
  const io = socketio(server, {})

  initHandlers(client)

  io.sockets
    .on(
      "connection",
      socketioJwt.authorize({
        decodedPropertyName: "decoded_token",
        secret: config.SECRET,
        timeout: 15000 // 15 seconds to send the authentication message
      })
    )
    .on("authenticated", (socket: Socket) => {
      initializeSocket(socket)
    })
}
