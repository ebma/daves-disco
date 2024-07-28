import { Server as HttpServer } from "http"
import jwt from "jsonwebtoken"
import { Server, Socket } from "socket.io"
import config from "../utils/config"
import { initHandlers } from "./handlers/init"
import WebSocketHandler from "./WebSocketHandler"
import { Client } from "discord.js"

function initializeSocket(socket: Socket, guildID: GuildID, userID: UserID) {
  WebSocketHandler.addSocket(socket, guildID, userID)
}

const trustedOrigins = ["https://daves-disco.marcel-ebert.de", "http://localhost:3000"]

export function startSocketConnection(httpServer: HttpServer, client: Client) {
  const io = new Server(httpServer, {
    cors: {
      origin: trustedOrigins
    }
  })

  // initHandlers(client)

  io.on("connection", socket => {
    socket.on("authenticate", (data: any) => {
      const token = data.token
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
