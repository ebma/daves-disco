import { config } from "dotenv"
import { startSocketConnection } from "./socket/socket"
import https from "https"
import { trackError } from "./shared/util/trackError"
import { MyClient } from "./MyClient"

if (process.env.NODE_ENV !== "production") {
  config()
}

process.on("unhandledRejection", (error: any) => trackError(error, "Unhandled Promise Rejection"))

function preventSleeping() {
  if (process.env.DEPLOYED_URL) {
    setInterval(() => {
      https.get(process.env.DEPLOYED_URL)
    }, 1000 * 60 * 5)
  }
}

const client = new MyClient()

startSocketConnection(client)

client.login(process.env.BOT_TOKEN)

preventSleeping()
