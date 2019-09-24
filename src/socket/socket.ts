import { AkairoClient } from "discord-akairo"
import express from "express"
import { Server } from "http"
import socketio, { Socket } from "socket.io"
import { handleControlMessages } from "./controlMessages"
import { handleCommandMessages } from "./commandMessages"

function initializeSocket(socket: Socket, client: AkairoClient) {
  socket.on("command", handleCommandMessages(socket, client))

  socket.on("control", handleControlMessages(socket, client))

  socket.on("disconnect", () => {
    console.log("connection closed by user")
  })
}

export function startSocketConnection(client: AkairoClient) {
  const app = express()
  const http = new Server(app)
  const io = socketio(http, {})
  const port = process.env.PORT || 1234

  io.on("connection", socket => {
    initializeSocket(socket, client)
    console.log("new connection")
  })

  http.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}
