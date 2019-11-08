import React from "react"
import io from "socket.io-client"
import {
  ControlMessage,
  ControlMessageResponse,
  InfoMessage,
  InfoMessageType,
  CommandMessageType,
  CommandMessage,
  ControlMessageType
} from "../../../src/typings/exported-types"
import { trackError } from "../lib/trackError"

const path =
  process.env.NODE_ENV === "production" && process.env.REACT_APP_BOT_SERVER_PATH
    ? process.env.REACT_APP_BOT_SERVER_PATH
    : "http://localhost:1234"
const MAX_RECONNECTION_ATTEMPTS = 10

let messageID = 1

function getNextMessageID() {
  return messageID++
}

export type MessageListener = (message: any) => void

export interface SocketContextType {
  connectionState: ConnectionState
  guildID: string
  userID: string
  addListener: (type: InfoMessageType, listener: MessageListener) => () => void // returns unsubscribe method
  sendCommand: (command: CommandMessageType, data?: any) => Promise<any>
  sendControlMessage: (type: ControlMessage["type"], data?: any) => Promise<any>
  setGuildID: (guildID: string) => void
  setUserID: (userID: string) => void
}

const SocketContext = React.createContext<SocketContextType>({
  connectionState: "disconnected",
  guildID: "",
  userID: "",
  addListener: () => () => undefined,
  sendCommand: () => Promise.reject("SocketProvider not ready."),
  sendControlMessage: () => Promise.reject("SocketProvider not ready."),
  setGuildID: () => undefined,
  setUserID: () => undefined
})

interface Props {
  children: React.ReactNode
}

export type ConnectionState = "disconnected" | "reconnecting" | "connected"

function SocketProvider(props: Props) {
  const [connectionState, setConnectionState] = React.useState<ConnectionState>("disconnected")
  const [currentSocket, setCurrentSocket] = React.useState<SocketIOClient.Socket | null>(null)
  const [guildID, setGuildID] = React.useState<string>("")
  const [userID, setUserID] = React.useState<string>("")

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

  const addListener = (type: InfoMessageType, listener: MessageListener) => {
    if (currentSocket) {
      currentSocket.on("event", (response: InfoMessage) => {
        if (response.type !== type) return
        listener(response.data)
      })
    }

    return () => {
      if (currentSocket) {
        currentSocket.removeListener("event", listener)
      }
    }
  }

  const createCommandDataPackage = React.useCallback(
    (command: CommandMessageType, data?: any): CommandMessage => {
      return { command, messageID: getNextMessageID(), guildID, userID, data }
    },
    [guildID, userID]
  )

  const sendCommand = React.useCallback(
    (command: CommandMessageType, data?: any) => {
      return new Promise<any>((resolve, reject) => {
        if (currentSocket) {
          const dataPackage = createCommandDataPackage(command, data)
          currentSocket.emit("command", dataPackage)

          currentSocket.on("event", (response: any) => {
            if (response && response.messageID && response.messageID === dataPackage.messageID) {
              if (response.error) {
                reject(response.error)
              } else {
                resolve(response.result)
              }
            }
          })
        } else {
          reject("No socket available")
        }
      })
    },
    [createCommandDataPackage, currentSocket]
  )

  const createControlMessageDataPackage = React.useCallback(
    (type: ControlMessageType, data?: any): ControlMessage => {
      return { type, messageID: getNextMessageID(), guildID, data }
    },
    [guildID]
  )

  const sendControlMessage = React.useCallback(
    (type: ControlMessageType, data?: any) => {
      return new Promise<any>((resolve, reject) => {
        if (currentSocket) {
          const dataPackage = createControlMessageDataPackage(type, data)
          currentSocket.emit("control", dataPackage)

          currentSocket.on("event", (response: any) => {
            if (response && response.messageID && response.messageID === dataPackage.messageID) {
              if (response.error) {
                console.log("rejecting message", response)
                reject(response.error)
              } else {
                console.log("resolving message", response)
                resolve(response.result)
              }
            }
          })
        } else {
          reject("No socket available")
        }
      })
    },
    [createControlMessageDataPackage, currentSocket]
  )

  const contextValue: SocketContextType = {
    addListener,
    connectionState,
    userID,
    guildID,
    sendCommand,
    sendControlMessage,
    setGuildID,
    setUserID
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
