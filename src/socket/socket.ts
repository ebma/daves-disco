import { AkairoClient } from "discord-akairo"
import express from "express"
import { Server } from "http"
import socketio, { Socket } from "socket.io"
import { createControlMessageListener } from "./controlMessages"
import { createCommandMessageListener } from "./commandMessages"
import MessageSender from "./MessageSender"

function initializeSocket(socket: Socket, client: AkairoClient) {
  MessageSender.setSocket(socket)

  const controlMessageListener = createControlMessageListener(socket, client)
  const commandMessageListener = createCommandMessageListener(socket, client)

  socket.on("command", commandMessageListener)
  socket.on("control", controlMessageListener)
  socket.on("disconnect", () => undefined)
}

export function startSocketConnection(client: AkairoClient) {
  const app = express()
  const http = new Server(app)
  const io = socketio(http, {})
  const port = process.env.PORT || 1234

  io.on("connection", socket => {
    initializeSocket(socket, client)
  })

  http.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`listening on port ${port}`)
  })
}
