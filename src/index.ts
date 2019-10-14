import { config } from "dotenv"
import { AkairoClient } from "discord-akairo"
import { startSocketConnection } from "./socket/socket"
import https from "https"

if (process.env.NODE_ENV !== "production") {
  config()
}

function preventSleeping() {
  if (process.env.DEPLOYED_URL) {
    setInterval(() => {
      https.get(process.env.DEPLOYED_URL)
    }, 1000 * 60 * 5)
  }
}

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

startSocketConnection(client)

client.login(process.env.BOT_TOKEN)

preventSleeping()
