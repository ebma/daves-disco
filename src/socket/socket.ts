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

  io.use(
    socketioJwt.authorize({
      decodedPropertyName: "decoded_token",
      secret: config.SECRET,
      handshake: true
    })
  )

  io.on("connection", (socket: Socket) => {
    initializeSocket(socket)
  })
}
