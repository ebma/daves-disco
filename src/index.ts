import { config } from "dotenv"
import { AkairoClient } from "discord-akairo"

if (process.env.NODE_ENV !== "production") {
  config()
}

const client = new AkairoClient(
  {
    ownerID: process.env.OWNER_ID,
    prefix: "!",
    allowMention: true,
    defaultCooldown: 4000,
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

client.login(process.env.BOT_TOKEN)
