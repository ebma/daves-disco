import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import { trackError } from "../shared/util/trackError"

function createCommandMessageListener(
  socket: Socket,
  client: AkairoClient
): (message: CommandMessage) => Promise<void> {
  const listener = async (message: CommandMessage) => {
    const sendCommandResult = (result: any) => {
      socket.emit("event", { command: message.command, messageID: message.messageID, result })
    }

    const sendCommandError = (error: any) => {
      socket.emit("event", { command: message.command, messageID: message.messageID, error })
    }

    const command = client.commandHandler.findCommand(message.command)

    if (!message.guildID) {
      sendCommandError("You must specify a guildID!")
    } else {
      try {
        const result = await command.exec(null, message, false)
        sendCommandResult(result)
      } catch (error) {
        trackError(error, "handleCommandMessages")
        sendCommandError(error.message ? error.message : error)
      }
    }
  }

  return listener
}

export { createCommandMessageListener }
