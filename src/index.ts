import { config } from "dotenv"
import { AkairoClient } from "discord-akairo"
import express from "express"
import { Server } from "http"
import socketio, { Socket } from "socket.io"
import SkipCommand from "./commands/music/skip"

if (process.env.NODE_ENV !== "production") {
  config()
}

const app = express()
const http = new Server(app)
const io = socketio(http, {})
const port = process.env.PORT || 1234

const client = new AkairoClient(
  {
    ownerID: process.env.OWNER_ID,
    prefix: "!",
    allowMention: true,
    defaultCooldown: 2000,
    defaultPrompt: {
      timeout: "Time ran out, command has been cancelled.",
      ended: "Too many retries, command has been cancelled.",
      cancel: "Command has been cancelled.",
      retries: 4,
      time: 30000
    },
    commandDirectory: __dirname + "/commands/",
    inhibitorDirectory: __dirname + "/inhibitors/",
    listenerDirectory: __dirname + "/listeners/"
  },
  {
    disableEveryone: true
  }
)

io.on("connection", socket => {
  console.log("new connection")
  initializeSocket(socket)
})

interface Data {
  command: string
  messageID: number
  userID: string
  guildID: string
  payload: string
}

function initializeSocket(socket: Socket) {
  socket.on("message", async (data: Data) => {
    console.log("data received", data)

    const command = client.commandHandler.findCommand(data.command)
    try {
      const result = await command.exec(null, data, false)
      socket.send({ command: data.command, messageID: data.messageID, result })
    } catch (error) {
      socket.send({ command: data.command, messageID: data.messageID, error })
    }
  })

  socket.on("disconnect", () => {
    console.log("connection closed by user")
  })
}

http.listen(port, () => {
  console.log(`listening on port ${port}`)
})

client.login(process.env.BOT_TOKEN)
