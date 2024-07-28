import * as Sentry from "@sentry/node"
import fs from "fs"
import http from "http"
import https from "https"
import { MyClient } from "./bot/MyClient"
import ActivityManager from "./libs/ActivityManager"
import { initApp } from "./server/app"
import { startSocketConnection } from "./socket/socket"
import config from "./utils/config"
import { trackError } from "./utils/trackError"
import { Bot } from "./structs/Bot"
import { Client, GatewayIntentBits } from "discord.js"

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: "https://c75d13359eb84b34b69108028e056e8a@o394107.ingest.sentry.io/5243834" })
}

process.on("unhandledRejection", (error: any) => trackError(error, "Unhandled Promise Rejection"))

// Export bot instance for use in other files
export let bot: Bot

async function start() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  })

  bot = new Bot(client)

  const app = await initApp(client)

  const port = config.PORT || 1234
  const server =
    process.env.NODE_ENV == "production"
      ? https
          .createServer(
            {
              key: fs.readFileSync(config.KEY_PATH),
              cert: fs.readFileSync(config.CERT_PATH),
            },
            app
          )
          .listen(port, () => {
            console.log(`HTTPS server listening on port ${port}`)
          })
      : http.createServer(app).listen(port, () => {
          console.log(`HTTP server listening on port ${port}`)
        })

  startSocketConnection(server, client)

  client.login(config.BOT_TOKEN).then(() => {
    ActivityManager.setUser(client.user)
  })
}

start()
