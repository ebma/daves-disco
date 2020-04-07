import http from "http"
import https from "https"
import { initApp } from "./server/app"
import config from "./utils/config"
import { MyClient } from "./bot/MyClient"
import { startSocketConnection } from "./socket/socket"
import { trackError } from "./utils/trackError"

process.on("unhandledRejection", (error: any) => trackError(error, "Unhandled Promise Rejection"))

const client = new MyClient()

const app = initApp(client)
const server = http.createServer(app)
const port = config.PORT || 1234

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})

startSocketConnection(server, client)

client.login(config.BOT_TOKEN)

function preventSleeping() {
  if (config.DEPLOYED_URL) {
    setInterval(() => {
      https.get(config.DEPLOYED_URL)
    }, 1000 * 60 * 5)
  }
}

preventSleeping()
