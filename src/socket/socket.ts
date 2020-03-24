import express from "express"
import { Server } from "http"
import socketio, { Socket } from "socket.io"
import { initHandlers } from "./messageHandlers"
import { MyClient } from "../MyClient"
import WebSocketHandler from "./WebSocketHandler"

function initializeSocket(socket: Socket) {
  WebSocketHandler.addSocket(socket)
}

export function startSocketConnection(client: MyClient) {
  const app = express()
  const http = new Server(app)
  const io = socketio(http, {})
  const port = process.env.PORT || 1234

  initHandlers(client)

  io.on("connection", socket => {
    initializeSocket(socket)
  })

  http.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`listening on port ${port}`)
  })
}
