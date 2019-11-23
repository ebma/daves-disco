import { Socket } from "socket.io"
import { trackError } from "../shared/util/trackError"

class MessageSender {
  socket: Socket

  isReady() {
    return this.socket !== null
  }

  setSocket(socket: Socket) {
    this.socket = socket
  }

  sendResultResponse = (originalMessage: ControlMessage, result: any) => {
    const response: ControlMessageResponse = {
      type: originalMessage.type,
      messageID: originalMessage.messageID,
      result
    }

    this.emitMessage(response)
  }

  sendErrorResponse = (originalMessage: ControlMessage, error: string) => {
    const response: ControlMessageResponse = { type: originalMessage.type, messageID: originalMessage.messageID, error }
    this.emitMessage(response)
  }

  sendMessage = (type: InfoMessageType, data?: any) => {
    const message: InfoMessage = { type, data }
    this.emitMessage(message)
  }

  private emitMessage(message: any) {
    if (this.socket) {
      this.socket.emit("event", message)
    } else {
      trackError(`Can't emit message ${message.type}. No socket available`)
    }
  }
}

export default new MessageSender()
