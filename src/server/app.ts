import cors from "cors"
import express from "express"
require("express-async-errors")
import { connect } from "../db/connection"
import config from "../utils/config"
import { MyClient } from "../bot/MyClient"
import middleware from "./middleware"
import { createGuildRouter } from "./controllers/guilds"
import { createLoginRouter } from "./controllers/login"
import playlistsRouter from "./controllers/playlists"
import tracksRouter from "./controllers/tracks"

connect(config.MONGODB_URI)

export function initApp(client: MyClient) {
  const app = express()

  const guildRouter = createGuildRouter(client)
  const loginRouter = createLoginRouter(client)

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)

  app.use("/api/playlists", playlistsRouter)
  app.use("/api/tracks", tracksRouter)
  app.use("/api/login", loginRouter)
  app.use("/api/guilds", guildRouter)

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  return app
}
