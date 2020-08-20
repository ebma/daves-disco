import { Socket } from "socket.io"
import { trackError } from "../utils/trackError"

type MessageHandler<Message extends keyof IPC.MessageType> = (
  guildID: GuildID,
  userID: UserID,
  ...args: any
) => IPC.MessageReturnType<Message> | Promise<IPC.MessageReturnType<Message>>

export type MessageHandlers = {
  [eventName in keyof IPC.MessageType]?: MessageHandler<keyof IPC.MessageType>
}

let messageHandlers: MessageHandlers = {}

class MessageSender {
  socket: Socket
  guildID: GuildID
  userID: UserID

  constructor(socket: Socket, guildID: GuildID, userID: UserID) {
    this.socket = socket
    this.guildID = guildID
    this.userID = userID
  }

  async handleMessageEvent<Message extends keyof IPC.MessageType>(
    messageType: Message,
    messageID: number,
    payload: IPC.MessageArgs<Message>
  ) {
    const messageHandler = messageHandlers[messageType]

    if (messageHandler) {
      try {
        const result = await messageHandler(this.guildID, this.userID, ...payload)
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
    data: IPC.MessageReturnType<Message>
  ): void {
    this.emitMessage({ messageType, guildID, data })
  }

  private emitMessage(message: any) {
    try {
      this.socket.emit("message", message)
    } catch (error) {
      trackError(`Could not emit message: ${error}`, "MessageSender.emitMessage")
    }
  }
}

export class WebSocketHandler {
  senders: MessageSender[] = []

  addSocket(socket: Socket, guildID: GuildID, userID: UserID) {
    const messageSender = new MessageSender(socket, guildID, userID)
    this.senders.push(messageSender)

    const messageHandler = (message: IPC.SocketMessage) =>
      messageSender.handleMessageEvent(message.messageType, message.messageID, message.args)

    socket.on("message", messageHandler)

    socket.on("disconnect", () => (this.senders = this.senders.filter(sender => sender !== messageSender)))
  }

  addHandler<Message extends keyof IPC.MessageType>(messageType: Message, handler: MessageHandler<Message>) {
    messageHandlers = {
      ...messageHandlers,
      [messageType]: handler
    }
  }

  sendMessage<Message extends keyof IPC.MessageType>(
    messageType: Message,
    guildID: GuildID,
    data?: IPC.MessageReturnType<Message>
  ): void {
    for (const sender of this.senders) {
      sender.sendMessage(messageType, guildID, data)
    }
  }
}

export default new WebSocketHandler()
