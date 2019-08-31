import { config } from "dotenv"
import { AkairoClient } from "discord-akairo"

if (process.env.NODE_ENV !== "production") {
  config()
}

const client = new AkairoClient(
  {
    ownerID: process.env.OWNER_ID,
    prefix: "!",
    defaultCooldown: 4000,
    commandDirectory: __dirname + "/commands/",
    inhibitorDirectory: __dirname + "/inhibitors/",
    listenerDirectory: __dirname + "/listeners/"
  },
  {
    disableEveryone: true
  }
)

client.login(process.env.BOT_TOKEN)
