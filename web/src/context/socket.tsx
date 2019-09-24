import React from "react"
import io from "socket.io-client"

const path = "http://localhost:1234"

let messageID = 0

function getNextMessageID() {
  return messageID++
}

export interface SocketContextType {
  socket: SocketIOClient.Socket | null
  sendMessage: (command: string, data?: any) => Promise<any>
  setGuildID: (guildID: string) => void
  setUserID: (userID: string) => void
}

const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  sendMessage: () => Promise.reject("SocketProvider not ready."),
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

  const createDataPackage = (command: string, data?: any) => {
    return { command, messageID: getNextMessageID(), guildID: currentGuildID, userID: currentUserID, ...data }
  }

  const sendMessage = (command: string, data?: any) => {
    return new Promise<any>((resolve, reject) => {
      if (currentSocket) {
        const dataPackage = createDataPackage(command, data)
        currentSocket.send(dataPackage)

        currentSocket.on(command, (response: any) => {
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

  const contextValue: SocketContextType = {
    socket: currentSocket,
    sendMessage,
    setGuildID: setCurrentGuildID,
    setUserID: setCurrentUserID
  }

  return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>
}

export { SocketProvider, SocketContext }
