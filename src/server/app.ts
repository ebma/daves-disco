import cors from "cors"
import express from "express"
require("express-async-errors")
import { connect } from "../db/connection"
import config from "../utils/config"
import { MyClient } from "../bot/MyClient"
import middleware from "./middleware"
import { createGuildRouter } from "./controllers/guilds"
import { createLoginRouter } from "./controllers/login"
import { createPlayerRouter } from "./controllers/player"
import playlistsRouter from "./controllers/playlists"
import tracksRouter from "./controllers/tracks"
import youtubeRouter from "./controllers/youtube"

connect(config.MONGODB_URI)

export function initApp(client: MyClient) {
  const app = express()

  const guildRouter = createGuildRouter(client)
  const loginRouter = createLoginRouter(client)
  const playerRouter = createPlayerRouter(client)

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)

  app.use("/api/playlists", playlistsRouter)
  app.use("/api/tracks", tracksRouter)
  app.use("/api/login", loginRouter)
  app.use("/api/guilds", guildRouter)
  app.use("/api/player", playerRouter)
  app.use("/api/youtube", youtubeRouter)

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  return app
}
