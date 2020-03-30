import React from "react"
import io from "socket.io-client"
import { trackError } from "./notifications"
import { Messages } from "../shared/ipc"

const path =
  process.env.NODE_ENV === "production" && process.env.BOT_SERVER_PATH
    ? process.env.BOT_SERVER_PATH
    : "http://localhost:1234"
const MAX_RECONNECTION_ATTEMPTS = 10

let messageID = 1

type UnsubscribeFn = () => void

function isErrorResponse<Message extends keyof IPC.MessageType>(
  response: IPC.CallResponseMessage<Message>
): response is IPC.CallErrorMessage<Message> {
  return (response as IPC.CallErrorMessage<Message>).error !== undefined
}

function getAuthTokenFromStorage() {
  return localStorage.getItem("auth-token")
}

function saveAuthTokenToStorage(token: string) {
  localStorage.setItem("auth-token", token)
}

export interface SocketContextType {
  authenticated: boolean
  authenticate: (guild: GuildID, user: UserID) => Promise<void>
  connectionState: ConnectionState
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
  authenticated: false,
  authenticate: () => Promise.reject("Not ready yet"),
  connectionState: "disconnected",
  sendMessage: () => Promise.reject("Not ready yet"),
  subscribeToMessages: () => () => undefined
})

interface Props {
  children: React.ReactNode
}

function SocketProvider(props: Props) {
  const [connectionState, setConnectionState] = React.useState<ConnectionState>("disconnected")
  const [currentSocket, setCurrentSocket] = React.useState<SocketIOClient.Socket | null>(null)
  const [authToken, setAuthToken] = React.useState<string | null>(getAuthTokenFromStorage)
  const [authenticated, setAuthenticated] = React.useState<boolean>(false)

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

        currentSocket.emit("message", { messageType, messageID: currentID, token: authToken, args })
      })

      return responsePromise
    },
    [authToken, currentSocket]
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

  const authenticate = React.useCallback(
    async (guildID: GuildID, userID: UserID) => {
      try {
        if (!authToken) {
          const newToken = await sendMessage(Messages.Authenticate, guildID, userID)
          setAuthenticated(true)
          saveAuthTokenToStorage(newToken)
          setAuthToken(newToken)
        } else {
          const isAuthenticated = await sendMessage(Messages.IsAuthenticated, guildID, userID, authToken)
          setAuthenticated(isAuthenticated)
        }
      } catch (error) {
        throw Error(`Authentication failed: ${error}`)
      }
    },
    [authToken, sendMessage]
  )

  const contextValue: SocketContextType = {
    authenticated,
    authenticate,
    connectionState,
    sendMessage,
    subscribeToMessages
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
