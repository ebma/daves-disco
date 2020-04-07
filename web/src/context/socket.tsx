import React from "react"
import io from "socket.io-client"
import { trackError } from "./notifications"

const path = process.env.BOT_SERVER_PATH ? process.env.BOT_SERVER_PATH : "http://localhost:1234"
const MAX_RECONNECTION_ATTEMPTS = 10

let messageID = 1

type UnsubscribeFn = () => void

function isErrorResponse<Message extends keyof IPC.MessageType>(
  response: IPC.CallResponseMessage<Message>
): response is IPC.CallErrorMessage<Message> {
  return (response as IPC.CallErrorMessage<Message>).error !== undefined
}

export interface SocketContextType {
  connectionState: ConnectionState
  init: (token: string) => Promise<void>
  sendMessage: <Message extends keyof IPC.MessageType>(
    messageType: Message,
    ...args: IPC.MessageArgs<Message>
  ) => Promise<IPC.MessageReturnType<Message>>
  subscribeToMessages: <Message extends keyof IPC.MessageType>(
    messageType: Message,
    callback: (message: IPC.MessageReturnType<Message>) => void
  ) => UnsubscribeFn
}

const SocketContext = React.createContext<SocketContextType>({
  connectionState: "disconnected",
  init: () => Promise.reject("Not ready yet"),
  sendMessage: () => Promise.reject("Not ready yet"),
  subscribeToMessages: () => () => undefined
})

interface Props {
  children: React.ReactNode
}

function SocketProvider(props: Props) {
  const [connectionState, setConnectionState] = React.useState<ConnectionState>("disconnected")
  const [currentSocket, setCurrentSocket] = React.useState<SocketIOClient.Socket | null>(null)

  const init = React.useCallback((token: string) => {
    return new Promise<void>((resolve, reject) => {
      const socket = io.connect(path, {
        forceNew: true,
        reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS
      })

      setCurrentSocket(socket)

      socket.on("reconnecting", () => setConnectionState("reconnecting"))

      socket.on("reconnect_failed", () => setConnectionState("disconnected"))

      socket.on("reconnect", () => setConnectionState("connected"))

      socket.on("connect", () => {
        socket
          .emit("authenticate", { token })
          .on("authenticated", () => {
            setConnectionState("connected")
            resolve()
          })
          .on("unauthorized", (msg: any) => {
            reject(`unauthorized: ${JSON.stringify(msg.data)}`)
          })
      })

      socket.on("disconnect", () => setConnectionState("disconnected"))

      socket.on("error", trackError)
    })
  }, [])

  const sendMessage = React.useCallback(
    function sendMessage<Message extends keyof IPC.MessageType>(
      messageType: Message,
      ...args: IPC.MessageArgs<Message>
    ): Promise<IPC.MessageReturnType<Message>> {
      if (!currentSocket) {
        return Promise.reject("Socket not available")
      }
      const currentID = messageID++

      const responsePromise = new Promise<IPC.MessageReturnType<Message>>((resolve, reject) => {
        const eventListener = (message: IPC.CallResponseMessage<Message>) => {
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
            reject(message.error)
          } else {
            resolve(message.result)
          }
        }

        currentSocket.on("message", eventListener)
        const unsubscribe = () => currentSocket.removeEventListener("message", eventListener)

        currentSocket.emit("message", { messageType, messageID: currentID, args })
      })

      return responsePromise
    },
    [currentSocket]
  )

  const subscribeToMessages = React.useCallback(
    function subscribeToMessages<Message extends keyof IPC.MessageType>(
      messageType: Message,
      callback: (message: IPC.MessageReturnType<Message>) => void
    ): UnsubscribeFn {
      if (!currentSocket) {
        return () => Error("Socket not available")
      }

      const eventListener = (message: IPC.ServerMessage<Message>) => {
        if (message.messageType === messageType) {
          callback(message.data)
        }
      }
      currentSocket.on("message", eventListener)

      return () => currentSocket.removeEventListener("message", eventListener)
    },
    [currentSocket]
  )

  const contextValue: SocketContextType = {
    connectionState,
    init,
    sendMessage,
    subscribeToMessages
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
