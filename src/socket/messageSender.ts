import { Socket } from "socket.io"
import { ControlMessageResponse, ControlMessage, InfoMessageType, InfoMessage } from "../typings/exported-types"

// tslint:disable: no-console
let sendMessage = (type: InfoMessageType, data?: any) => console.error("SendEvent not ready yet")
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
    const message: InfoMessage = { type, data }
    socket.emit("event", message)
  }
}

export { setupMessageSender, sendResultResponse, sendErrorResponse, sendMessage }
