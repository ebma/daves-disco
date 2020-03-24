import express from "express"
import { Server } from "http"
import socketio, { Socket } from "socket.io"
import MessageSender from "./MessageSender"
import { initHandlers } from "./messageHandlers"
import { MyClient } from "../MyClient"

function initializeSocket(socket: Socket, client: MyClient) {
  MessageSender.setSocket(socket)

  initHandlers(client)

  const messageHandler = (message: IPC.SocketMessage) =>
    MessageSender.handleMessageEvent(message.messageType, message.messageID, message.args)

  socket.on("message", messageHandler)

  socket.on("disconnect", () => undefined)
}

export function startSocketConnection(client: MyClient) {
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
