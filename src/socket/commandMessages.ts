import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"

export interface CommandMessage {
  command: string
  messageID: number
  userID: string
  guildID: string
  payload: string
}

const handleCommandMessages = (socket: Socket, client: AkairoClient) => async (data: CommandMessage) => {
  const sendCommandResult = (result: any) => {
    socket.emit("event", { command: data.command, messageID: data.messageID, result })
  }

  const sendCommandError = (error: any) => {
    socket.emit("event", { command: data.command, messageID: data.messageID, error })
  }

  const command = client.commandHandler.findCommand(data.command)
  try {
    const result = await command.exec(null, data, false)
    sendCommandResult(result)
  } catch (error) {
    sendCommandError(error)
  }
}

export { handleCommandMessages }
