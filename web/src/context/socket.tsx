import React from "react"
import io from "socket.io-client"
import { trackError } from "./notifications"

const path =
  process.env.NODE_ENV === "production" && process.env.BOT_SERVER_PATH
    ? process.env.BOT_SERVER_PATH
    : "http://localhost:1234"
const MAX_RECONNECTION_ATTEMPTS = 10

let messageID = 1

type UnsubscribeFn = () => void

function getGuildIDFromLocalStorage() {
  const storedGuildID = localStorage.getItem("guildID")
  return storedGuildID ? storedGuildID : ""
}

function getUserIDFromLocalStorage() {
  const storedUserID = localStorage.getItem("userID")
  return storedUserID ? storedUserID : ""
}

function isErrorResponse<Message extends keyof IPC.MessageType>(
  response: IPC.CallResponseMessage<Message>
): response is IPC.CallErrorMessage<Message> {
  return (response as IPC.CallErrorMessage<Message>).error !== undefined
}

export interface SocketContextType {
  connectionState: ConnectionState
  guildID: string
  userID: string
  sendMessage: <Message extends keyof IPC.MessageType>(
    messageType: Message,
    ...args: IPC.MessageArgs<Message>
  ) => Promise<IPC.MessageReturnType<Message>>
  subscribeToMessages: <Message extends keyof IPC.MessageType>(
    messageType: Message,
    callback: (message: any) => void
  ) => UnsubscribeFn
  setGuildID: (guildID: string) => void
  setUserID: (userID: string) => void
}

const SocketContext = React.createContext<SocketContextType>({
  connectionState: "disconnected",
  guildID: "",
  userID: "",
  sendMessage: () => Promise.reject("Not ready yet"),
  subscribeToMessages: () => () => undefined,
  setGuildID: () => undefined,
  setUserID: () => undefined
})

interface Props {
  children: React.ReactNode
}

function SocketProvider(props: Props) {
  const [connectionState, setConnectionState] = React.useState<ConnectionState>("disconnected")
  const [currentSocket, setCurrentSocket] = React.useState<SocketIOClient.Socket | null>(null)
  const [guildID, setGuildID] = React.useState<GuildID>(getGuildIDFromLocalStorage)
  const [userID, setUserID] = React.useState<UserID>(getUserIDFromLocalStorage)

  React.useEffect(() => {
    const socket = io(path, {
      forceNew: true,
      reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
      timeout: 10000
    })

    setCurrentSocket(socket)

    socket.on("reconnecting", () => setConnectionState("reconnecting"))

    socket.on("reconnect_failed", () => setConnectionState("disconnected"))

    socket.on("reconnect", () => setConnectionState("connected"))

    socket.on("connect", () => setConnectionState("connected"))

    socket.on("disconnect", () => setConnectionState("disconnected"))

    socket.on("error", trackError)
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
      callback: (message: any) => void
    ): UnsubscribeFn {
      if (!currentSocket) {
        return () => Error("Socket not available")
      }

      const eventListener = (message: IPC.CallResponseMessage<Message>) => {
        if (message.messageType === messageType) {
          if (isErrorResponse(message)) {
            trackError(message.error)
          } else {
            callback(message.result)
          }
        }
      }
      currentSocket.on("message", eventListener)

      return () => currentSocket.removeEventListener("message", eventListener)
    },
    [currentSocket]
  )

  const contextValue: SocketContextType = {
    connectionState,
    userID,
    guildID,
    sendMessage,
    subscribeToMessages,
    setGuildID: (guildID: string) => {
      localStorage.setItem("guildID", guildID)
      setGuildID(guildID)
    },
    setUserID: (userID: string) => {
      localStorage.setItem("userID", userID)
      setUserID(userID)
    }
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
