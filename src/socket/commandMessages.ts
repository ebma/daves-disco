import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import { CommandMessage } from "../shared/exported-types"
import { trackError } from "../shared/util/trackError"

const handleCommandMessages = (socket: Socket, client: AkairoClient) => async (data: CommandMessage) => {
  const sendCommandResult = (result: any) => {
    socket.emit("event", { command: data.command, messageID: data.messageID, result })
  }

  const sendCommandError = (error: any) => {
    socket.emit("event", { command: data.command, messageID: data.messageID, error })
  }

  const command = client.commandHandler.findCommand(data.command)
  if (!data.guildID) {
    sendCommandError("You must specify a guildID!")
  } else {
    try {
      const result = await command.exec(null, data, false)
      sendCommandResult(result)
    } catch (error) {
      trackError(error, this)
      sendCommandError(error.message ? error.message : error)
    }
  }
}

export { handleCommandMessages }
