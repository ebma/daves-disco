import io from "socket.io-client"
import { Middleware } from "@reduxjs/toolkit"
import { RootState } from "../../app/rootReducer"
import {
  initAuthenticationAction,
  setConnectionState,
  socketError,
  sendMessageAction,
  subscribeToMessagesAction,
  unsubscribeFromMessagesAction
} from "../socketSlice"

const path = process.env.BOT_SERVER_PATH ? process.env.BOT_SERVER_PATH : "http://localhost:1234"

function isErrorResponse<Message extends keyof IPC.MessageType>(
  response: IPC.CallResponseMessage<Message>
): response is IPC.CallErrorMessage<Message> {
  return (response as IPC.CallErrorMessage<Message>).error !== undefined
}

interface SocketListener {
  callback: (...args: any[]) => void
  listener: (...args: any[]) => void
}

const socketMiddleware: Middleware<{}, RootState> = store => {
  const socket = io.connect(path, {
    forceNew: true,
    reconnectionAttempts: 10
  })

  let listeners: SocketListener[] = []
  let messageID = 1

  socket.on("disconnect", () => store.dispatch(setConnectionState("disconnected")))
  socket.on("error", (error: Error) => store.dispatch(socketError(error?.message)))
  socket.on("reconnecting", () => store.dispatch(setConnectionState("reconnecting")))
  socket.on("reconnect", () => store.dispatch(setConnectionState("connected")))
  socket.on("reconnect_failed", () => store.dispatch(setConnectionState("disconnected")))
  socket.on("connect", () => store.dispatch(setConnectionState("connected")))

  return next => action => {
    if (initAuthenticationAction.match(action)) {
      const { token } = action.payload

      socket
        .emit("authenticate", { token })
        .on("authenticated", () => {
          store.dispatch(setConnectionState("authenticated"))
        })
        .on("unauthorized", (msg: any) => store.dispatch(socketError(`unauthorized: ${JSON.stringify(msg.data)}`)))
        .on("error", (error: any) => store.dispatch(socketError(error)))
    } else if (sendMessageAction.match(action)) {
      const { successCallback, errorCallback, messageType, ...args } = action.payload

      const currentID = messageID++

      const eventListener = <Message extends keyof IPC.MessageType>(message: IPC.CallResponseMessage<Message>) => {
        if (
          !message ||
          typeof message !== "object" ||
          message.messageID !== currentID ||
          message.messageType !== messageType
        ) {
          return
        }

        unsubscribe()

        if (isErrorResponse(message)) {
          errorCallback(message.error)
        } else {
          successCallback(message.result)
        }
      }

      socket.on("message", eventListener)
      const unsubscribe = () => socket.removeEventListener("message", eventListener)

      socket.emit("message", { messageType, messageID: currentID, ...args })
    } else if (subscribeToMessagesAction.match(action)) {
      const { callback, guildID, messageType } = action.payload

      const eventListener = <Message extends keyof IPC.MessageType>(message: IPC.ServerMessage<Message>) => {
        if (message.messageType === messageType && message.guildID === guildID) {
          callback(message.data)
        }
      }

      const socketListener = { listener: eventListener, callback: callback }
      listeners.push(socketListener)

      socket.on("message", eventListener)
    } else if (unsubscribeFromMessagesAction.match(action)) {
      const { callback } = action.payload

      const foundListener = listeners.find(listener => listener.callback === callback)
      if (foundListener) {
        console.log("removing found listener", foundListener)
        socket.removeEventListener("message", foundListener.listener)
      }
    } else {
      return next(action)
    }
  }
}

export default socketMiddleware
