import { Socket } from "socket.io"
import { ControlMessageResponse, ControlMessage, InfoMessageType } from "./../types/exported-types"

// tslint:disable: no-console
let sendMessage = (type: string, data?: any) => console.error("SendEvent not ready yet")
let sendResultResponse = (originalMessage: ControlMessage, result: any) =>
  console.error("sendSuccessResponse not ready yet")
let sendErrorResponse = (originalMessage: ControlMessage, error: string) =>
  console.error("sendErrorResponse not ready yet")

function setupMessageSender(socket: Socket) {
  sendResultResponse = (originalMessage: ControlMessage, result: any) => {
    const response: ControlMessageResponse = {
      type: originalMessage.type,
      messageID: originalMessage.messageID,
      result
    }
    socket.emit("event", response)
  }

  sendErrorResponse = (originalMessage: ControlMessage, error: string) => {
    const response: ControlMessageResponse = { type: originalMessage.type, messageID: originalMessage.messageID, error }
    socket.emit("event", response)
  }

  sendMessage = (type: InfoMessageType, data: any) => {
    socket.emit("event", { type, data })
  }
}

export { setupMessageSender, sendResultResponse, sendErrorResponse, sendMessage }
