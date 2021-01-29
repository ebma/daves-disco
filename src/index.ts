import * as Sentry from "@sentry/node"
import fs from "fs"
import http from "http"
import https from "https"
import * as path from "path"
import { MyClient } from "./bot/MyClient"
import { initApp } from "./server/app"
import { startSocketConnection } from "./socket/socket"
import config from "./utils/config"
import { trackError } from "./utils/trackError"

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: "https://c75d13359eb84b34b69108028e056e8a@o394107.ingest.sentry.io/5243834" })
}

process.on("unhandledRejection", (error: any) => trackError(error, "Unhandled Promise Rejection"))

const client = new MyClient()

const app = initApp(client)

const server =
  process.env.NODE_ENV == "production"
    ? https.createServer(
        {
          key: fs.readFileSync(config.KEY_PATH),
          cert: fs.readFileSync(config.CERT_PATH)
        },
        app
      )
    : http.createServer(app)

const port = config.PORT || 1234

server.listen(port, () => {
  console.log(`listening on port ${port}`)
})

startSocketConnection(server, client)

client.login(config.BOT_TOKEN)
