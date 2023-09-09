import io from "socket.io-client"
import { Middleware } from "@reduxjs/toolkit"
import { RootState } from "../../app/rootReducer"
import {
  initAuthenticationAction,
  setConnectionState,
  setError,
  sendMessageAction,
  subscribeToMessagesAction,
  unsubscribeFromMessagesAction,
  setAuthError,
  disconnectSocketAction,
} from "../socketSlice"
import { setAuthToken } from "../../services/axios-client"

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

function createSocket() {
  const socket = io.connect(path, {
    forceNew: true,
    reconnectionAttempts: 10,
  })
  return socket
}

const socketMiddleware: Middleware<{}, RootState> = (store) => {
  const socket = createSocket()

  const listeners: SocketListener[] = []
  let messageID = 1

  socket.on("disconnect", () => store.dispatch(setConnectionState("disconnected")))
  socket.on("error", (error: Error) => store.dispatch(setError(error?.message)))
  socket.on("reconnecting", () => store.dispatch(setConnectionState("reconnecting")))
  socket.on("reconnect", () => store.dispatch(setConnectionState("connected")))
  socket.on("reconnect_failed", () => store.dispatch(setConnectionState("disconnected")))
  socket.on("connect", () => store.dispatch(setConnectionState("connected")))
  socket.on("authenticated", () => {
    store.dispatch(setConnectionState("authenticated"))
    store.dispatch(setAuthError(null))
  })
  socket.on("unauthorized", (error: Error) => {
    try {
      const message = error.message
      if (message.includes("jwt expired")) {
        store.dispatch(setAuthError("jwt-expired"))
      }
    } catch (error: any) {
      store.dispatch(setError(`unauthorized: ${JSON.stringify(error?.data)}`))
    }
  })

  return (next) => (action) => {
    if (initAuthenticationAction.match(action)) {
      const { token } = action.payload
      socket.emit("authenticate", { token })
      setAuthToken(token)
    } else if (disconnectSocketAction.match(action)) {
      socket.disconnect()
      socket.connect() // automatically reconnect
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
      const { callback, messageType } = action.payload

      const eventListener = <Message extends keyof IPC.MessageType>(message: IPC.ServerMessage<Message>) => {
        if (message.messageType === messageType) {
          callback(message.data)
        }
      }

      const socketListener = { listener: eventListener, callback }
      listeners.push(socketListener)

      socket.on("message", eventListener)
    } else if (unsubscribeFromMessagesAction.match(action)) {
      const { callback } = action.payload

      const foundListener = listeners.find((listener) => listener.callback === callback)
      if (foundListener) {
        socket.removeEventListener("message", foundListener.listener)
      }
    } else {
      return next(action)
    }
  }
}

export default socketMiddleware
