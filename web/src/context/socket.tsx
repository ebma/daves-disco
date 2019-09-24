import React from "react"
import io from "socket.io-client"

const path = "http://localhost:1234"
const MAX_RECONNECTION_ATTEMPTS = 10

let messageID = 1


function getNextMessageID() {
  return messageID++
}

export interface SocketContextType {
  connectionState: ConnectionState
  sendCommand: (command: string, data?: any) => Promise<any>
  sendControlMessage: (messageType: string, data?: any) => Promise<any>
  setGuildID: (guildID: string) => void
  setUserID: (userID: string) => void
}

const SocketContext = React.createContext<SocketContextType>({
  connectionState: "disconnected",
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
  const [currentGuildID, setCurrentGuildID] = React.useState<string>("")
  const [currentUserID, setCurrentUserID] = React.useState<string>("")

  React.useEffect(() => {
    const socket = io(path, {
      forceNew: true,
      reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
      timeout: 10000,
    })

    setCurrentSocket(socket)

    socket.on("reconnecting", () => setConnectionState("reconnecting"))

    socket.on("reconnect_failed", () => setConnectionState("disconnected"))

    socket.on("reconnect", () => setConnectionState("connected"))

    socket.on("connect", () => setConnectionState("connected"))

    socket.on("disconnect", () => setConnectionState("disconnected"))

    socket.on("error", (error: string) => {
      console.error(error)
    })
  }, [])

  const createCommandDataPackage = (command: string, data?: any) => {
    return { command, messageID: getNextMessageID(), guildID: currentGuildID, userID: currentUserID, ...data }
  }

  const sendCommand = (command: string, data?: any) => {
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
  }

  const createControlMessageDataPackage = (type: string, data?: any) => {
    return { type, messageID: getNextMessageID(), guildID: currentGuildID, userID: currentUserID, ...data }
  }
  const sendControlMessage = (type: string, data?: any) => {
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
              console.log("resolving message", response.result)
              resolve(response.result)
            }
          }
        })
      } else {
        reject("No socket available")
      }
    })
  }

  const contextValue: SocketContextType = {
    connectionState,
    sendCommand,
    sendControlMessage,
    setGuildID: setCurrentGuildID,
    setUserID: setCurrentUserID
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
