import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import { trackError } from "../shared/util/trackError"

type MessageHandler<Message extends keyof IPC.MessageType> = (
  ...args: any
) => IPC.MessageReturnType<Message> | Promise<IPC.MessageReturnType<Message>>

export type MessageHandlers = {
  [eventName in keyof IPC.MessageType]?: MessageHandler<keyof IPC.MessageType>
}

let messageHandlers: MessageHandlers = {}

class MessageSender {
  socket: Socket

  isReady() {
    return this.socket !== null
  }

  setSocket(socket: Socket) {
    this.socket = socket
  }

  addHandler<Message extends keyof IPC.MessageType>(
    messageType: Message,
    handler: (
      ...args: IPC.MessageArgs<Message>
    ) => IPC.MessageReturnType<Message> | Promise<IPC.MessageReturnType<Message>>
  ) {
    messageHandlers = {
      ...messageHandlers,
      [messageType]: handler
    }
  }

  async handleMessageEvent<Message extends keyof IPC.MessageType>(
    client: AkairoClient,
    messageType: Message,
    messageID: number,
    payload: IPC.MessageArgs<Message>
  ) {
    const command = client.commandHandler.findCommand(messageType)
    const messageHandler = messageHandlers[messageType]

    if (command) {
      try {
        const result = await command.exec(null, payload, false)
        this.sendSuccessResponse(messageType, messageID, result)
      } catch (error) {
        trackError(error, "handleMessageEvent")
        this.sendErrorResponse(messageType, messageID, error)
      }
    } else if (messageHandler) {
      try {
        const result = await messageHandler(...payload)
        this.sendSuccessResponse(messageType, messageID, result)
      } catch (error) {
        trackError(error, "handleMessageEvent")
        this.sendErrorResponse(messageType, messageID, error.message ? error.message : error)
      }
    } else {
      throw Error(`Neither command nor message handler defined for message type "${messageType}".`)
    }
  }

  sendSuccessResponse = (messageType: string, messageID: any, result?: any) => {
    const response = {
      messageType,
      messageID,
      result
    }

    this.emitMessage(response)
  }

  sendErrorResponse = (messageType: string, messageID: any, error: any) => {
    const response = {
      messageType,
      messageID,
      error
    }
    this.emitMessage(response)
  }

  sendMessage<Message extends keyof IPC.MessageType>(
    messageType: Message,
    guildID: GuildID,
    ...args: IPC.MessageArgs<Message>
  ): void {
    this.emitMessage({ messageType, guildID, args })
  }

  private emitMessage(message: any) {
    if (this.socket) {
      this.socket.emit("message", message)
    } else {
      trackError(`Cannot emit message ${message.type}. No socket available`, "MessageSender.emitMessage")
    }
  }
}

export default new MessageSender()
