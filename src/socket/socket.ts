import { Server } from "http"
import jwt from "jsonwebtoken"
import socketio, { Socket } from "socket.io"
import { MyClient } from "../bot/MyClient"
import config from "../utils/config"
import { initHandlers } from "./handlers/init"
import WebSocketHandler from "./WebSocketHandler"

function initializeSocket(socket: Socket, guildID: GuildID, userID: UserID) {
  WebSocketHandler.addSocket(socket, guildID, userID)
}

export function startSocketConnection(server: Server, client: MyClient) {
  const io = socketio(server, {})

  initHandlers(client)

  io.sockets.on("connection", socket => {
    socket.on("authenticate", ({ token }) => {
      jwt.verify(token, config.SECRET, (error: any, decodedToken: DecodedToken) => {
        if (error) {
          socket.emit("unauthorized", error)
        } else if (!decodedToken.userID || !decodedToken.guildID) {
          socket.emit("unauthorized", new Error("Invalid token"))
          return
        } else {
          socket.emit("authenticated")
          initializeSocket(socket, decodedToken.guildID, decodedToken.userID)
        }
      })
    })
  })
}
