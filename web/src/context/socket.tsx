import React from "react"
import io from "socket.io-client"

const path = "http://localhost:1234"

let messageID = 1

function getNextMessageID() {
  return messageID++
}

export interface SocketContextType {
  socket: SocketIOClient.Socket | null
  sendCommand: (command: string, data?: any) => Promise<any>
  sendControlMessage: (messageType: string, data?: any) => Promise<any>
  setGuildID: (guildID: string) => void
  setUserID: (userID: string) => void
}

const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  sendCommand: () => Promise.reject("SocketProvider not ready."),
  sendControlMessage: () => Promise.reject("SocketProvider not ready."),
  setGuildID: () => undefined,
  setUserID: () => undefined
})

interface Props {
  children: React.ReactNode
}

function SocketProvider(props: Props) {
  const [currentSocket, setCurrentSocket] = React.useState<SocketIOClient.Socket | null>(null)
  const [currentGuildID, setCurrentGuildID] = React.useState<string>("")
  const [currentUserID, setCurrentUserID] = React.useState<string>("")

  React.useEffect(() => {
    const socket = io(path, {
      forceNew: true,
      reconnectionAttempts: Infinity,
      timeout: 10000
    })

    setCurrentSocket(socket)

    socket.on("reconnecting", () => {
      console.log("trying to reconnect")
    })

    socket.on("reconnect", () => {
      console.log("successfully reconnected")
    })

    socket.on("connect", () => console.log("connected from react"))

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
    socket: currentSocket,
    sendCommand,
    sendControlMessage,
    setGuildID: setCurrentGuildID,
    setUserID: setCurrentUserID
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
